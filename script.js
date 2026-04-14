const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const API_ENABLED = ['http:', 'https:'].includes(window.location.protocol);

async function apiRequest(url, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        ...options
    };

    const response = await fetch(url, config);
    const isJson = response.headers.get('content-type')?.includes('application/json');
    const payload = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        throw new Error(payload?.message || 'Something went wrong. Please try again.');
    }

    return payload;
}

function createBubbles() {
    const container = document.getElementById('bubbles');
    if (!container) return;

    container.innerHTML = '';

    const bubbleCount = window.innerWidth < 768 ? 10 : 18;
    const colors = [
        'rgba(166, 136, 109, 0.16)',
        'rgba(156, 115, 73, 0.12)',
        'rgba(204, 170, 131, 0.14)',
        'rgba(243, 236, 229, 0.22)'
    ];

    for (let index = 0; index < bubbleCount; index += 1) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';

        const size = Math.random() * 60 + 18;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.left = `${Math.random() * 100}%`;
        bubble.style.background = colors[Math.floor(Math.random() * colors.length)];
        bubble.style.animationDuration = `${Math.random() * 12 + 16}s`;
        bubble.style.animationDelay = `${Math.random() * 8}s`;

        container.appendChild(bubble);
    }
}

function handleNavScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const syncNavbar = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 24);
    };

    syncNavbar();
    window.addEventListener('scroll', syncNavbar, { passive: true });
}

function setupMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    if (!navToggle || !navLinks) return;

    const closeMenu = () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    };

    const openMenu = () => {
        navLinks.classList.add('active');
        navToggle.classList.add('active');
        navToggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('nav-open');
    };

    navToggle.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (event) => {
        if (!navLinks.classList.contains('active')) return;
        if (navLinks.contains(event.target) || navToggle.contains(event.target)) return;
        closeMenu();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
    });
}

function setupScrollAnimations() {
    const targets = document.querySelectorAll('[data-reveal], .scroll-animate');
    if (!targets.length) return;

    if (prefersReducedMotion.matches) {
        targets.forEach((target) => target.classList.add('is-visible', 'visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible', 'visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach((target) => observer.observe(target));
}

function setupBeforeAfterSlider() {
    const sliders = document.querySelectorAll('.ba-comparison-slider, .ba-slider');
    if (!sliders.length) return;

    sliders.forEach((slider) => {
        const handle = slider.querySelector('.ba-handle');
        const before = slider.querySelector('.ba-before');
        if (!handle || !before) return;

        let isDragging = false;

        const updateSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
            before.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        };

        const startDragging = () => { isDragging = true; };
        const stopDragging = () => { isDragging = false; };

        handle.addEventListener('mousedown', startDragging);
        handle.addEventListener('touchstart', startDragging, { passive: true });
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);

        document.addEventListener('mousemove', (event) => {
            if (isDragging) updateSlider(event.clientX);
        });

        document.addEventListener('touchmove', (event) => {
            if (isDragging) updateSlider(event.touches[0].clientX);
        }, { passive: true });

        slider.addEventListener('click', (event) => {
            if (event.target.closest('.ba-handle')) return;
            updateSlider(event.clientX);
        });

        const midpoint = slider.getBoundingClientRect().left + (slider.getBoundingClientRect().width / 2);
        updateSlider(midpoint);
    });
}

function setupFilterButtons(buttonSelector, cardSelector) {
    const buttons = document.querySelectorAll(buttonSelector);
    const cards = document.querySelectorAll(cardSelector);
    if (!buttons.length || !cards.length) return;

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');

            buttons.forEach((item) => item.classList.remove('active'));
            button.classList.add('active');

            cards.forEach((card) => {
                const category = card.getAttribute('data-category');
                const isVisible = filter === 'all' || category === filter;
                card.style.display = isVisible ? '' : 'none';
            });
        });
    });
}

function setupFAQ() {
    const toggles = document.querySelectorAll('.faq-toggle');
    if (!toggles.length) return;

    toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            const item = toggle.closest('.faq-item-home, .faq-item');
            const answer = item ? item.querySelector('.faq-answer-home, .faq-answer') : null;
            if (!item || !answer) return;

            const isOpen = item.classList.contains('active');

            document.querySelectorAll('.faq-item-home.active, .faq-item.active').forEach((openItem) => {
                if (openItem === item) return;
                openItem.classList.remove('active');
                const openAnswer = openItem.querySelector('.faq-answer-home, .faq-answer');
                const openToggle = openItem.querySelector('.faq-toggle');
                if (openAnswer) openAnswer.style.maxHeight = null;
                if (openToggle) openToggle.setAttribute('aria-expanded', 'false');
            });

            item.classList.toggle('active', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
            answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : null;
        });
    });
}

function buildFallbackAvailability(year, month) {
    const availability = {};
    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastDay = new Date(year, month, 0).getDate();

    for (let day = 1; day <= lastDay; day += 1) {
        const date = new Date(year, month - 1, day);
        if (date < todayDate || date.getDay() === 0) continue;

        const dateKey = date.toISOString().split('T')[0];
        availability[dateKey] = date.getDay() === 6
            ? ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM']
            : ['9:00 AM', '10:30 AM', '12:00 PM', '1:30 PM', '3:00 PM', '4:30 PM', '6:00 PM'];
    }

    return availability;
}

function setupConsultationCalendar() {
    const calendar = document.getElementById('consultationCalendar');
    if (!calendar) return;

    const monthLabel = document.getElementById('calendarMonth');
    const grid = document.getElementById('calendarGrid');
    const prevButton = document.getElementById('calendarPrev');
    const nextButton = document.getElementById('calendarNext');
    const timeSlotGrid = document.getElementById('timeSlotGrid');
    const selectedDateLabel = document.getElementById('selectedDateLabel');
    const selection = document.getElementById('calendarSelection');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    if (!monthLabel || !grid || !prevButton || !nextButton || !timeSlotGrid || !selectedDateLabel || !selection || !dateInput || !timeInput) return;

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let currentMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
    let selectedDate = null;
    let selectedTime = '';
    let currentAvailability = {};
    const availabilityCache = new Map();

    const formatDateLong = (date) => date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const formatDateShort = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const formatDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const getMonthKey = () => `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
    const isCurrentMonthOrEarlier = () => currentMonth.getFullYear() < todayDate.getFullYear() || (currentMonth.getFullYear() === todayDate.getFullYear() && currentMonth.getMonth() <= todayDate.getMonth());

    const syncSelectionText = (message) => {
        if (message) {
            selection.textContent = message;
            return;
        }

        if (!selectedDate || !selectedTime) {
            selection.textContent = selectedDate
                ? `Selected ${formatDateLong(selectedDate)}. Now choose a preferred time.`
                : 'No consultation slot selected yet.';
            return;
        }

        selection.textContent = `Selected consultation: ${formatDateLong(selectedDate)} at ${selectedTime}.`;
    };

    const renderTimeSlots = () => {
        timeSlotGrid.innerHTML = '';

        if (!selectedDate) {
            selectedDateLabel.textContent = 'Choose a date to view openings';
            syncSelectionText();
            return;
        }

        const dateKey = formatDateKey(selectedDate);
        const slots = currentAvailability[dateKey] || [];
        selectedDateLabel.textContent = formatDateLong(selectedDate);

        if (!slots.length) {
            syncSelectionText('That day is no longer available. Please choose another date.');
            return;
        }

        slots.forEach((slot) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'time-slot';
            button.textContent = slot;

            if (slot === selectedTime) {
                button.classList.add('is-selected');
            }

            button.addEventListener('click', () => {
                selectedTime = slot;
                timeInput.value = slot;
                renderTimeSlots();
                syncSelectionText();
            });

            timeSlotGrid.appendChild(button);
        });

        syncSelectionText();
    };

    const drawCalendar = () => {
        grid.innerHTML = '';
        monthLabel.textContent = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        prevButton.disabled = isCurrentMonthOrEarlier();

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const offset = (firstDay.getDay() + 6) % 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let index = 0; index < offset; index += 1) {
            const spacer = document.createElement('div');
            spacer.className = 'calendar-day-empty';
            grid.appendChild(spacer);
        }

        for (let day = 1; day <= daysInMonth; day += 1) {
            const date = new Date(year, month, day);
            const dateKey = formatDateKey(date);
            const slots = currentAvailability[dateKey] || [];
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'calendar-day';
            button.textContent = String(day);

            const isPast = date < todayDate;
            const isToday = date.getTime() === todayDate.getTime();
            const isSelected = selectedDate && date.getTime() === selectedDate.getTime();

            if (isToday) button.classList.add('is-today');
            if (isSelected) button.classList.add('is-selected');

            if (isPast || !slots.length) {
                button.disabled = true;
            } else {
                button.addEventListener('click', () => {
                    selectedDate = date;
                    selectedTime = '';
                    dateInput.value = formatDateLong(date);
                    timeInput.value = '';
                    drawCalendar();
                    renderTimeSlots();
                });
            }

            grid.appendChild(button);
        }
    };

    const loadAvailability = async () => {
        const monthKey = getMonthKey();
        if (availabilityCache.has(monthKey)) {
            currentAvailability = availabilityCache.get(monthKey);
            return;
        }

        try {
            if (!API_ENABLED) throw new Error('API unavailable');
            const data = await apiRequest(`/api/availability?year=${currentMonth.getFullYear()}&month=${currentMonth.getMonth() + 1}`);
            currentAvailability = data.availability || {};
        } catch {
            currentAvailability = buildFallbackAvailability(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
        }

        availabilityCache.set(monthKey, currentAvailability);
    };

    const loadAndRenderCalendar = async () => {
        syncSelectionText('Loading consultation availability...');
        await loadAvailability();
        drawCalendar();
        renderTimeSlots();
    };

    prevButton.addEventListener('click', async () => {
        if (prevButton.disabled) return;
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        selectedDate = null;
        selectedTime = '';
        dateInput.value = '';
        timeInput.value = '';
        await loadAndRenderCalendar();
    });

    nextButton.addEventListener('click', async () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        selectedDate = null;
        selectedTime = '';
        dateInput.value = '';
        timeInput.value = '';
        await loadAndRenderCalendar();
    });

    loadAndRenderCalendar();
}

function setupFullBookingForm() {
    const form = document.getElementById('bookingFormFull');
    if (!form) return;

    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const payload = Object.fromEntries(new FormData(form).entries());
        payload.newsletter = Boolean(form.querySelector('#newsletter')?.checked);

        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            if (!API_ENABLED) throw new Error('Please run the site through the local Node server to submit live bookings.');
            const data = await apiRequest('/api/bookings', {
                method: 'POST',
                body: JSON.stringify(payload)
            });

            form.innerHTML = `
                <div style="text-align:center;padding:30px 12px;">
                    <p style="letter-spacing:.14em;text-transform:uppercase;color:#9c7349;font-size:.8rem;margin-bottom:10px;">Consultation request received</p>
                    <h3 style="font-size:1.9rem;margin-bottom:12px;color:#1f1917;">We will be in touch shortly${data.booking?.firstname ? `, ${data.booking.firstname}` : ''}.</h3>
                    <p style="color:#6d635c;max-width:560px;margin:0 auto 22px;line-height:1.8;">We noted your preferred consultation timing for ${data.booking?.date || payload.date}${data.booking?.time ? ` at ${data.booking.time}` : payload.time ? ` at ${payload.time}` : ''}. A member of the Lumina concierge team will follow up to confirm availability, answer questions, and guide your next step.</p>
                    <button type="button" class="btn btn-primary" onclick="window.location.reload()">Submit another request</button>
                </div>
            `;
        } catch (error) {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            const message = form.querySelector('.form-message') || document.createElement('div');
            message.className = 'form-message';
            message.setAttribute('role', 'status');
            message.setAttribute('aria-live', 'polite');
            message.textContent = error.message;
            if (!message.parentElement) {
                form.insertBefore(message, submitButton);
            }
        }
    });
}

function setupNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter-form');
    if (!forms.length) return;

    forms.forEach((form) => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = form.querySelector('button');
            const input = form.querySelector('input');
            if (!button || !input) return;

            const email = input.value.trim();
            if (!email) return;

            const originalText = button.textContent;
            button.disabled = true;
            button.textContent = 'Joining...';

            try {
                if (!API_ENABLED) throw new Error('Please run the site through the local server to save newsletter signups.');
                await apiRequest('/api/newsletter', {
                    method: 'POST',
                    body: JSON.stringify({ email })
                });
                button.textContent = 'Joined';
                input.value = '';
            } catch {
                button.disabled = false;
                button.textContent = originalText;
            }
        });
    });
}

function setupHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    if (!slider || slides.length < 2 || !dots.length) return;

    let currentSlide = 0;
    let intervalId = null;

    const goToSlide = (index) => {
        slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
        dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
        currentSlide = index;
    };

    const startAutoplay = () => {
        if (prefersReducedMotion.matches) return;
        intervalId = window.setInterval(() => {
            const nextSlide = (currentSlide + 1) % slides.length;
            goToSlide(nextSlide);
        }, 5200);
    };

    const stopAutoplay = () => {
        if (intervalId) {
            window.clearInterval(intervalId);
            intervalId = null;
        }
    };

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = Number(dot.getAttribute('data-slide'));
            stopAutoplay();
            goToSlide(index);
            startAutoplay();
        });
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    startAutoplay();
}

function setupHeroParallax() {
    const heroSlider = document.getElementById('heroSlider');
    if (!heroSlider || prefersReducedMotion.matches) return;

    const updateParallax = () => {
        const offset = Math.min(window.scrollY * 0.16, 70);
        heroSlider.style.transform = `translateY(${offset}px)`;
    };

    updateParallax();
    window.addEventListener('scroll', updateParallax, { passive: true });
}

function initializeSite() {
    createBubbles();
    handleNavScroll();
    setupMobileNav();
    setupScrollAnimations();
    setupBeforeAfterSlider();
    setupFilterButtons('.ba-filter-btn', '.ba-card');
    setupFilterButtons('.review-filter-btn', '.review-card-full');
    setupFAQ();
    setupConsultationCalendar();
    setupFullBookingForm();
    setupNewsletterForms();
    setupHeroSlider();
    setupHeroParallax();
}

document.addEventListener('DOMContentLoaded', initializeSite);
window.addEventListener('resize', createBubbles);
