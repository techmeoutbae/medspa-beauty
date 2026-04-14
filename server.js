const http = require('http');
const path = require('path');
const fs = require('fs/promises');
const { createReadStream, existsSync } = require('fs');
const { randomUUID } = require('crypto');

const PORT = Number(process.env.PORT) || 3000;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.ico': 'image/x-icon',
    '.svg': 'image/svg+xml'
};

function sendJson(response, statusCode, payload) {
    response.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, message) {
    response.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end(message);
}

async function ensureDataFiles() {
    await fs.mkdir(DATA_DIR, { recursive: true });

    if (!existsSync(BOOKINGS_FILE)) {
        await fs.writeFile(BOOKINGS_FILE, '[]', 'utf8');
    }

    if (!existsSync(SUBSCRIBERS_FILE)) {
        await fs.writeFile(SUBSCRIBERS_FILE, '[]', 'utf8');
    }
}

async function readJson(filePath) {
    try {
        const file = await fs.readFile(filePath, 'utf8');
        return JSON.parse(file || '[]');
    } catch {
        return [];
    }
}

async function writeJson(filePath, data) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function createDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getBaseTimeSlots(date) {
    const day = date.getDay();
    if (day === 0) return [];
    if (day === 6) return ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM'];
    return ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'];
}

function buildAvailability(year, month, bookings) {
    const availability = {};
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastDay = new Date(year, month, 0).getDate();

    for (let day = 1; day <= lastDay; day += 1) {
        const date = new Date(year, month - 1, day);
        const dateKey = createDateKey(date);

        if (date < todayDate) continue;

        const slots = getBaseTimeSlots(date);
        if (!slots.length) continue;

        const bookedTimes = new Set(
            bookings
                .filter((booking) => booking.dateKey === dateKey)
                .map((booking) => booking.time)
        );

        const openSlots = slots.filter((slot) => !bookedTimes.has(slot));
        if (openSlots.length) {
            availability[dateKey] = openSlots;
        }
    }

    return availability;
}

async function parseBody(request) {
    const chunks = [];

    for await (const chunk of request) {
        chunks.push(chunk);
        const size = chunks.reduce((total, item) => total + item.length, 0);
        if (size > 1_000_000) {
            throw new Error('Request body too large');
        }
    }

    const raw = Buffer.concat(chunks).toString('utf8');
    return raw ? JSON.parse(raw) : {};
}

async function handleAvailability(requestUrl, response) {
    const year = Number(requestUrl.searchParams.get('year'));
    const month = Number(requestUrl.searchParams.get('month'));

    if (!year || !month || month < 1 || month > 12) {
        return sendJson(response, 400, { message: 'Valid year and month are required.' });
    }

    const bookings = await readJson(BOOKINGS_FILE);
    const availability = buildAvailability(year, month, bookings);
    return sendJson(response, 200, { year, month, availability });
}

async function handleBooking(request, response) {
    const payload = await parseBody(request);
    const requiredFields = ['firstname', 'lastname', 'email', 'phone', 'service', 'date', 'time'];
    const missingField = requiredFields.find((field) => !String(payload[field] || '').trim());

    if (missingField) {
        return sendJson(response, 400, { message: `Missing required field: ${missingField}` });
    }

    if (!isValidEmail(payload.email)) {
        return sendJson(response, 400, { message: 'Please provide a valid email address.' });
    }

    const selectedDate = new Date(payload.date);
    if (Number.isNaN(selectedDate.getTime())) {
        return sendJson(response, 400, { message: 'Please select a valid consultation date.' });
    }

    const dateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const dateKey = createDateKey(dateOnly);
    const bookings = await readJson(BOOKINGS_FILE);
    const availability = buildAvailability(dateOnly.getFullYear(), dateOnly.getMonth() + 1, bookings);
    const openSlots = availability[dateKey] || [];

    if (!openSlots.includes(payload.time)) {
        return sendJson(response, 409, { message: 'That consultation slot is no longer available. Please choose another time.' });
    }

    const booking = {
        id: randomUUID(),
        firstname: String(payload.firstname).trim(),
        lastname: String(payload.lastname).trim(),
        email: String(payload.email).trim(),
        phone: String(payload.phone).trim(),
        service: String(payload.service).trim(),
        date: dateOnly.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
        dateKey,
        time: String(payload.time).trim(),
        message: String(payload.message || '').trim(),
        newsletter: Boolean(payload.newsletter),
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);
    await writeJson(BOOKINGS_FILE, bookings);

    if (booking.newsletter) {
        const subscribers = await readJson(SUBSCRIBERS_FILE);
        const exists = subscribers.some((subscriber) => subscriber.email.toLowerCase() === booking.email.toLowerCase());
        if (!exists) {
            subscribers.push({ id: randomUUID(), email: booking.email, source: 'booking-form', createdAt: new Date().toISOString() });
            await writeJson(SUBSCRIBERS_FILE, subscribers);
        }
    }

    return sendJson(response, 201, {
        success: true,
        booking: {
            id: booking.id,
            firstname: booking.firstname,
            date: booking.date,
            time: booking.time
        }
    });
}

async function handleNewsletter(request, response) {
    const payload = await parseBody(request);
    const email = String(payload.email || '').trim();

    if (!email || !isValidEmail(email)) {
        return sendJson(response, 400, { message: 'Please provide a valid email address.' });
    }

    const subscribers = await readJson(SUBSCRIBERS_FILE);
    const existingSubscriber = subscribers.find((subscriber) => subscriber.email.toLowerCase() === email.toLowerCase());

    if (existingSubscriber) {
        return sendJson(response, 200, { success: true, existing: true });
    }

    subscribers.push({
        id: randomUUID(),
        email,
        source: 'newsletter-form',
        createdAt: new Date().toISOString()
    });

    await writeJson(SUBSCRIBERS_FILE, subscribers);
    return sendJson(response, 201, { success: true });
}

async function serveStatic(requestUrl, response) {
    let pathname = decodeURIComponent(requestUrl.pathname);
    if (pathname === '/') pathname = '/index.html';

    const safePath = path.normalize(path.join(ROOT_DIR, pathname));
    if (!safePath.startsWith(ROOT_DIR)) {
        return sendText(response, 403, 'Forbidden');
    }

    try {
        const stat = await fs.stat(safePath);
        const filePath = stat.isDirectory() ? path.join(safePath, 'index.html') : safePath;
        const extension = path.extname(filePath).toLowerCase();
        const mimeType = MIME_TYPES[extension] || 'application/octet-stream';

        response.writeHead(200, { 'Content-Type': mimeType });
        createReadStream(filePath).pipe(response);
    } catch {
        sendText(response, 404, 'Not found');
    }
}

const server = http.createServer(async (request, response) => {
    const requestUrl = new URL(request.url, `http://${request.headers.host || '127.0.0.1'}`);

    try {
        if (request.method === 'GET' && requestUrl.pathname === '/api/health') {
            return sendJson(response, 200, { ok: true });
        }

        if (request.method === 'GET' && requestUrl.pathname === '/api/availability') {
            return handleAvailability(requestUrl, response);
        }

        if (request.method === 'POST' && requestUrl.pathname === '/api/bookings') {
            return handleBooking(request, response);
        }

        if (request.method === 'POST' && requestUrl.pathname === '/api/newsletter') {
            return handleNewsletter(request, response);
        }

        if (request.method === 'GET') {
            return serveStatic(requestUrl, response);
        }

        return sendText(response, 405, 'Method not allowed');
    } catch (error) {
        const statusCode = error.message === 'Request body too large' ? 413 : 500;
        return sendJson(response, statusCode, { message: error.message || 'Unexpected server error.' });
    }
});

ensureDataFiles().then(() => {
    server.listen(PORT, () => {
        console.log(`Lumina Beauty demo running at http://127.0.0.1:${PORT}`);
    });
});
