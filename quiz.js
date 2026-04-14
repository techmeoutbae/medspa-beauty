const questions = [
    {
        key: 'concerns',
        weight: 3,
        question: 'What are your primary skin concerns?',
        helper: 'Choose up to 2 concerns that matter most right now.',
        options: [
            { value: 'aging', title: 'Fine lines and wrinkles', note: 'You want smoother, more refreshed-looking skin.', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop' },
            { value: 'acne', title: 'Breakouts and congestion', note: 'You are focused on clarity, texture, or pore refinement.', img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=160&h=160&fit=crop' },
            { value: 'hydration', title: 'Dryness and dehydration', note: 'You want skin to feel plumper, healthier, and more comfortable.', img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=160&h=160&fit=crop' },
            { value: 'brightness', title: 'Dullness and uneven tone', note: 'You are looking for more radiance and better overall tone.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=160&h=160&fit=crop' }
        ]
    },
    {
        key: 'skinTypes',
        weight: 2,
        question: 'How would you describe your skin type?',
        helper: 'Pick the options that best describe your day-to-day skin behavior.',
        options: [
            { value: 'oily', title: 'Oily', note: 'Prone to shine, congestion, or visible pores.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop' },
            { value: 'dry', title: 'Dry', note: 'Often feels tight, flaky, or lacking in glow.', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop' },
            { value: 'combination', title: 'Combination', note: 'Some areas feel oily while others need more nourishment.', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop' },
            { value: 'sensitive', title: 'Sensitive', note: 'More reactive, red, or easily irritated by products or treatments.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop' }
        ]
    },
    {
        key: 'goals',
        weight: 3,
        question: 'What aesthetic outcome are you hoping for?',
        helper: 'Choose the result profile that feels most aligned with your ideal look.',
        options: [
            { value: 'youthful', title: 'A more youthful appearance', note: 'You want to soften age cues and look more rested.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&h=160&fit=crop' },
            { value: 'glow', title: 'Radiant, glowing skin', note: 'You want brightness, freshness, and a healthy finish.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=160&h=160&fit=crop' },
            { value: 'defined', title: 'More definition and polish', note: 'You want a slightly more sculpted or refined overall look.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop' },
            { value: 'maintain', title: 'Maintain what is already working', note: 'You want a low-effort plan that supports your current look.', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop' }
        ]
    },
    {
        key: 'downtime',
        weight: 2,
        question: 'How much downtime can you realistically allow for?',
        helper: 'This helps narrow recommendations to treatments that fit your schedule.',
        options: [
            { value: 'none', title: 'None at all', note: 'You want something you can do and carry on with immediately.', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=160&h=160&fit=crop' },
            { value: 'minimal', title: 'A few hours', note: 'You are fine with temporary pinkness or mild sensitivity.', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=160&h=160&fit=crop' },
            { value: 'some', title: 'One to two days', note: 'You can accommodate a little recovery for stronger results.', img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=160&h=160&fit=crop' },
            { value: 'any', title: 'Downtime is not a concern', note: 'You are open to more corrective options if they are a better fit.', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=160&h=160&fit=crop' }
        ]
    },
    {
        key: 'interests',
        weight: 4,
        question: 'Which treatment types are you most interested in exploring?',
        helper: 'This question has the strongest impact on final recommendations.',
        options: [
            { value: 'facial', title: 'Facials and skin treatments', note: 'You are leaning toward skin health, glow, or corrective treatments.', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=160&h=160&fit=crop' },
            { value: 'injectables', title: 'Injectables (Botox or filler)', note: 'You are interested in smoothing, balancing, or restoring volume.', img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=160&h=160&fit=crop' },
            { value: 'lashes', title: 'Lash and brow treatments', note: 'You want faster day-to-day polish with low makeup effort.', img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=160&h=160&fit=crop' },
            { value: 'laser', title: 'Laser and advanced devices', note: 'You are open to more corrective technology-led options.', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop' }
        ]
    }
];

const treatments = [
    {
        name: 'HydraFacial',
        category: 'facial',
        description: 'Deep cleansing, exfoliation, and hydration for an immediately fresher, more luminous complexion.',
        price: 'From $225',
        img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=220&h=220&fit=crop',
        link: 'treatments.html#facials',
        matches: {
            concerns: ['hydration', 'brightness'],
            skinTypes: ['dry', 'combination', 'sensitive'],
            goals: ['glow', 'maintain'],
            downtime: ['none', 'minimal'],
            interests: ['facial']
        }
    },
    {
        name: 'Anti-Aging Facial',
        category: 'facial',
        description: 'A corrective facial designed to soften visible signs of aging while keeping skin looking refined and well-rested.',
        price: 'From $195',
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=220&h=220&fit=crop',
        link: 'treatments.html#facials',
        matches: {
            concerns: ['aging', 'brightness'],
            skinTypes: ['dry', 'combination'],
            goals: ['youthful', 'glow'],
            downtime: ['minimal', 'some'],
            interests: ['facial']
        }
    },
    {
        name: 'Brightening Facial',
        category: 'facial',
        description: 'A radiance-focused treatment for clients who want more even tone, more glow, and a polished event-ready finish.',
        price: 'From $175',
        img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=220&h=220&fit=crop',
        link: 'treatments.html#facials',
        matches: {
            concerns: ['brightness'],
            skinTypes: ['dry', 'combination', 'sensitive'],
            goals: ['glow'],
            downtime: ['none', 'minimal'],
            interests: ['facial']
        }
    },
    {
        name: 'Deep Cleansing Facial',
        category: 'facial',
        description: 'Ideal for congestion and texture concerns, with a focus on clarity, extraction, and skin reset.',
        price: 'From $135',
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=220&h=220&fit=crop',
        link: 'treatments.html#facials',
        matches: {
            concerns: ['acne'],
            skinTypes: ['oily', 'combination'],
            goals: ['maintain', 'glow'],
            downtime: ['none', 'minimal'],
            interests: ['facial']
        }
    },
    {
        name: 'Botox',
        category: 'injectables',
        description: 'A subtle injectable option for softening expression lines while keeping your face natural and expressive.',
        price: 'From $12/unit',
        img: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=220&h=220&fit=crop',
        link: 'treatments.html#injectables',
        matches: {
            concerns: ['aging'],
            skinTypes: ['dry', 'combination', 'sensitive'],
            goals: ['youthful', 'defined'],
            downtime: ['minimal', 'some'],
            interests: ['injectables']
        }
    },
    {
        name: 'Dermal Fillers',
        category: 'injectables',
        description: 'Restore balance and soft structure in a way that feels refined, customized, and never overdone.',
        price: 'From $650',
        img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=220&h=220&fit=crop',
        link: 'treatments.html#injectables',
        matches: {
            concerns: ['aging'],
            skinTypes: ['dry', 'combination'],
            goals: ['defined', 'youthful'],
            downtime: ['some', 'any'],
            interests: ['injectables']
        }
    },
    {
        name: 'Skin Boosters',
        category: 'injectables',
        description: 'Hydration-driven injectables for clients who want plumper, glowier skin with an elegant finish.',
        price: 'From $450',
        img: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=220&h=220&fit=crop',
        link: 'treatments.html#injectables',
        matches: {
            concerns: ['hydration', 'brightness'],
            skinTypes: ['dry', 'sensitive'],
            goals: ['glow', 'maintain'],
            downtime: ['minimal', 'some'],
            interests: ['injectables']
        }
    },
    {
        name: 'Volume Lash Extensions',
        category: 'lashes',
        description: 'For clients who want fuller, more dramatic lash definition while still maintaining softness and polish.',
        price: 'From $250',
        img: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=220&h=220&fit=crop',
        link: 'treatments.html#lashes',
        matches: {
            concerns: ['brightness'],
            skinTypes: ['dry', 'oily', 'combination', 'sensitive'],
            goals: ['defined', 'glow'],
            downtime: ['none'],
            interests: ['lashes']
        }
    },
    {
        name: 'Classic Lash Extensions',
        category: 'lashes',
        description: 'A lower-maintenance option for clients who want subtle lash enhancement and everyday polish.',
        price: 'From $175',
        img: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=220&h=220&fit=crop',
        link: 'treatments.html#lashes',
        matches: {
            concerns: ['brightness'],
            skinTypes: ['dry', 'oily', 'combination', 'sensitive'],
            goals: ['maintain', 'defined'],
            downtime: ['none'],
            interests: ['lashes']
        }
    },
    {
        name: 'Brow Lamination',
        category: 'lashes',
        description: 'A quick beauty service that creates more shape, lift, and structure with minimal ongoing effort.',
        price: 'From $95',
        img: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=220&h=220&fit=crop',
        link: 'treatments.html#lashes',
        matches: {
            concerns: ['brightness'],
            skinTypes: ['dry', 'oily', 'combination', 'sensitive'],
            goals: ['defined', 'maintain'],
            downtime: ['none'],
            interests: ['lashes']
        }
    },
    {
        name: 'IPL Photofacial',
        category: 'laser',
        description: 'A technology-led option for clients focused on uneven tone, visible sun damage, or redness correction.',
        price: 'From $350',
        img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=220&h=220&fit=crop',
        link: 'treatments.html#laser',
        matches: {
            concerns: ['brightness'],
            skinTypes: ['dry', 'combination'],
            goals: ['glow', 'maintain'],
            downtime: ['some', 'any'],
            interests: ['laser']
        }
    },
    {
        name: 'Laser Hair Removal',
        category: 'laser',
        description: 'A higher-efficiency, long-term solution for clients who want smoother skin and less maintenance over time.',
        price: 'From $150',
        img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=220&h=220&fit=crop',
        link: 'treatments.html#laser',
        matches: {
            concerns: ['brightness'],
            skinTypes: ['dry', 'oily', 'combination', 'sensitive'],
            goals: ['maintain'],
            downtime: ['minimal', 'some'],
            interests: ['laser']
        }
    },
    {
        name: 'Microneedling',
        category: 'laser',
        description: 'A corrective collagen-focused option for texture, fine lines, and stronger skin renewal over time.',
        price: 'From $400',
        img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=220&h=220&fit=crop',
        link: 'treatments.html#laser',
        matches: {
            concerns: ['aging', 'acne'],
            skinTypes: ['dry', 'combination'],
            goals: ['youthful', 'glow'],
            downtime: ['some', 'any'],
            interests: ['laser', 'facial']
        }
    }
];

const valueToLabel = Object.fromEntries(
    questions.flatMap((question) => question.options.map((option) => [option.value, option.title]))
);

let currentQuestion = 0;
let answers = {};

const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const questionText = document.getElementById('questionText');
const optionsContainer = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const quizCard = document.getElementById('quizCard');
const resultSection = document.getElementById('resultSection');
const resultCards = document.getElementById('resultCards');
const retakeBtn = document.getElementById('retakeBtn');
const selectionHint = document.getElementById('selectionHint');
const selectedCount = document.getElementById('selectedCount');
const questionNumber = document.getElementById('questionNumber');
const resultSummary = document.getElementById('resultSummary');
const resultBadges = document.getElementById('resultBadges');

function initQuiz() {
    currentQuestion = 0;
    answers = {};
    resultSection.hidden = true;
    quizCard.style.display = 'block';
    document.querySelector('.quiz-progress').style.display = 'block';
    document.querySelector('.quiz-nav').style.display = 'flex';
    renderQuestion();
}

function renderQuestion() {
    const question = questions[currentQuestion];
    const selectedAnswers = answers[currentQuestion] || [];

    questionText.textContent = question.question;
    document.querySelector('.quiz-subtext').textContent = question.helper;
    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressFill.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    selectionHint.textContent = selectedAnswers.length >= 2 ? 'Maximum selected for this question' : 'Choose up to 2 options';
    selectedCount.textContent = `${selectedAnswers.length} of 2 selected`;
    questionNumber.textContent = String(currentQuestion + 1).padStart(2, '0');

    optionsContainer.innerHTML = '';
    question.options.forEach((option) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiz-option';
        button.setAttribute('aria-pressed', selectedAnswers.includes(option.value) ? 'true' : 'false');

        if (selectedAnswers.includes(option.value)) {
            button.classList.add('selected');
        }

        button.innerHTML = `
            <img src="${option.img}" alt="${option.title}" class="option-img">
            <div class="option-copy">
                <span class="option-title">${option.title}</span>
                <span class="option-note">${option.note}</span>
            </div>
        `;

        button.addEventListener('click', () => toggleOption(option.value));
        optionsContainer.appendChild(button);
    });

    prevBtn.disabled = currentQuestion === 0;
    nextBtn.disabled = selectedAnswers.length === 0;
    nextBtn.textContent = currentQuestion === questions.length - 1 ? 'See Results' : 'Next';
}

function toggleOption(value) {
    if (!answers[currentQuestion]) {
        answers[currentQuestion] = [];
    }

    const selected = answers[currentQuestion];
    const index = selected.indexOf(value);

    if (index > -1) {
        selected.splice(index, 1);
    } else if (selected.length < 2) {
        selected.push(value);
    }

    renderQuestion();
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion += 1;
        renderQuestion();
        return;
    }

    showResults();
}

function prevQuestion() {
    if (currentQuestion === 0) return;
    currentQuestion -= 1;
    renderQuestion();
}

function scoreTreatments() {
    return treatments
        .map((treatment) => {
            let score = 0;
            const matchedValues = new Set();

            questions.forEach((question, questionIndex) => {
                const selected = answers[questionIndex] || [];
                const matches = treatment.matches[question.key] || [];

                selected.forEach((value) => {
                    if (matches.includes(value)) {
                        score += question.weight;
                        matchedValues.add(value);
                    }
                });
            });

            return {
                ...treatment,
                score,
                matchedValues: Array.from(matchedValues)
            };
        })
        .filter((treatment) => treatment.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

function buildSummary(topResults) {
    const selectedLabels = Object.values(answers)
        .flat()
        .map((value) => valueToLabel[value])
        .filter(Boolean);

    resultBadges.innerHTML = selectedLabels
        .slice(0, 8)
        .map((label) => `<span>${label}</span>`)
        .join('');

    if (!topResults.length) {
        resultSummary.textContent = 'We would recommend starting with a private consultation so the team can create a plan tailored to your goals.';
        return;
    }

    const leadLabels = selectedLabels.slice(0, 3).join(', ');
    resultSummary.textContent = leadLabels
        ? `Based on your priorities around ${leadLabels}, these are the treatments most aligned with your goals.`
        : 'Based on your answers, these are the treatments most aligned with your goals.';
}

function renderResults(topResults) {
    if (!topResults.length) {
        resultCards.innerHTML = `
            <article class="result-card">
                <div class="result-card-top">
                    <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=220&h=220&fit=crop" alt="Consultation" class="result-card-img">
                    <div>
                        <h3>Start with a consultation</h3>
                        <span class="price">Personalized assessment</span>
                    </div>
                </div>
                <p>If your goals are more nuanced, the strongest next step is a one-on-one consultation with tailored treatment planning.</p>
                <div class="result-reasons"><span>Custom recommendations</span><span>Transparent pricing</span><span>Low-pressure guidance</span></div>
                <a href="book.html" class="btn btn-primary">Book Consultation</a>
            </article>
        `;
        return;
    }

    resultCards.innerHTML = topResults.map((treatment) => {
        const reasons = treatment.matchedValues.slice(0, 3).map((value) => `<span>${valueToLabel[value]}</span>`).join('');

        return `
            <article class="result-card">
                <div class="result-card-top">
                    <img src="${treatment.img}" alt="${treatment.name}" class="result-card-img">
                    <div>
                        <h3>${treatment.name}</h3>
                        <span class="price">${treatment.price}</span>
                    </div>
                </div>
                <p>${treatment.description}</p>
                <div class="result-reasons">${reasons}</div>
                <a href="${treatment.link}" class="btn btn-primary">View Treatment</a>
            </article>
        `;
    }).join('');
}

function showResults() {
    const topResults = scoreTreatments();
    buildSummary(topResults);
    renderResults(topResults);

    quizCard.style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';
    document.querySelector('.quiz-nav').style.display = 'none';
    resultSection.hidden = false;
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

nextBtn.addEventListener('click', nextQuestion);
prevBtn.addEventListener('click', prevQuestion);
retakeBtn.addEventListener('click', initQuiz);

initQuiz();

