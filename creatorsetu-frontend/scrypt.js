console.log("script.js loaded");

// Standardize fallback fetch helper if apiFetch is not declared globally
const safeApiFetch = apiFetch;

const authShell = document.querySelector('[data-auth-shell]');
const authCard = document.querySelector('[data-auth-card]');
const dashboard = document.querySelector('[data-dashboard]');
const barChart = document.querySelector('[data-bar-chart]');
const activityFeed = document.querySelector('[data-activity-feed]');
const modeButtons = document.querySelectorAll('[data-mode-button]');
const authForms = document.querySelectorAll('[data-form]');
const welcomeName = document.querySelector('[data-welcome-name]');
const profileInitials = document.querySelector('[data-profile-initials]');

let earningsData = [];

const activityItems = [
    { badge: 'Payment', time: '2h ago', title: 'Brand collab payout received', text: 'You earned ₹680 from the latest sponsored Reel campaign.' },
    { badge: 'Growth', time: 'Yesterday', title: 'Audience milestone reached', text: 'Your creator community passed 24K followers across platforms.' },
    { badge: 'Savings', time: '2d ago', title: 'Savings goal updated', text: 'You moved 5% closer to the monthly reserve target.' },
    { badge: 'Impact', time: '3d ago', title: 'Donation allocated', text: 'A portion of this week\'s revenue was set aside for impact work.' }
];

function shortRupee(value) {
    if (value >= 1000) {
        const thousands = value / 1000;
        const rounded = Number.isInteger(thousands) ? thousands : Math.round(thousands * 10) / 10;
        return `₹${rounded}K`;
    }
    return `₹${value}`;
}

function buildEarningsChart(data) {
    const width = 620;
    const height = 320;

    const margin = {
        top: 34,
        right: 24,
        bottom: 44,
        left: 56
    };

    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const safeData = Array.isArray(data)
        ? data
            .map(item => ({
                month: item.month || "",
                value: Number(item.value) || 0
            }))
            .filter(item => Number.isFinite(item.value))
        : [];

    if (safeData.length === 0) {
        return `
            <svg
                class="earnings-chart"
                viewBox="0 0 ${width} ${height}"
                role="img"
                aria-label="Monthly earnings chart"
                preserveAspectRatio="xMidYMid meet"
            >
                <text
                    x="${width / 2}"
                    y="${height / 2}"
                    text-anchor="middle"
                    class="earnings-chart__axis"
                >
                    No earnings data yet
                </text>
            </svg>
        `;
    }

    const maxValue = Math.max(
        ...safeData.map(item => item.value),
        0
    );

    const safeMaxValue = maxValue > 0 ? maxValue : 1000;
    const tickCount = 4;
    const rawStep = safeMaxValue / tickCount;

    const step =
        rawStep > 10000
            ? Math.ceil(rawStep / 10000) * 10000
            : rawStep > 1000
                ? Math.ceil(rawStep / 1000) * 1000
                : Math.ceil(rawStep / 100) * 100;

    const maxY = Math.max(step * tickCount, 1000);
    const slotWidth = plotWidth / safeData.length;
    const barWidth = Math.min(slotWidth * 0.46, 60);

    const yFor = (value) => {
        const safeValue = Number(value) || 0;
        return (
            margin.top +
            plotHeight -
            (safeValue / maxY) * plotHeight
        );
    };

    const xCenter = (index) => margin.left + slotWidth * (index + 0.5);

    const gridLines = [];
    const axisLabels = [];

    for (let tick = 0; tick <= tickCount; tick++) {
        const value = step * tick;
        const y = yFor(value);

        gridLines.push(`
            <line
                x1="${margin.left}"
                y1="${y}"
                x2="${width - margin.right}"
                y2="${y}"
                class="earnings-chart__grid"
            />
        `);

        axisLabels.push(`
            <text
                x="${margin.left - 12}"
                y="${y + 4}"
                text-anchor="end"
                class="earnings-chart__axis"
            >
                ${shortRupee(value)}
            </text>
        `);
    }

    const bars = safeData
        .map((item, index) => {
            const x = xCenter(index) - barWidth / 2;
            const y = yFor(item.value);
            const barHeight = margin.top + plotHeight - y;

            return `
                <rect
                    x="${x}"
                    y="${y}"
                    width="${barWidth}"
                    height="${Math.max(barHeight, 0)}"
                    rx="10"
                    class="earnings-chart__bar"
                />
            `;
        })
        .join("");

    const linePoints = safeData
        .map((item, index) => `${xCenter(index)},${yFor(item.value)}`)
        .join(" ");

    const areaPoints = `
        ${margin.left},${margin.top + plotHeight}
        ${linePoints}
        ${width - margin.right},${margin.top + plotHeight}
    `;

    const markers = safeData
        .map((item, index) => {
            const cx = xCenter(index);
            const cy = yFor(item.value);

            return `
                <circle
                    cx="${cx}"
                    cy="${cy}"
                    r="5"
                    class="earnings-chart__dot"
                />

                <text
                    x="${cx}"
                    y="${cy - 14}"
                    text-anchor="middle"
                    class="earnings-chart__value"
                >
                    ${shortRupee(item.value)}
                </text>

                <text
                    x="${cx}"
                    y="${height - margin.bottom + 24}"
                    text-anchor="middle"
                    class="earnings-chart__label"
                >
                    ${item.month}
                </text>
            `;
        })
        .join("");

    return `
        <svg
            class="earnings-chart"
            viewBox="0 0 ${width} ${height}"
            role="img"
            aria-label="Monthly earnings chart"
            preserveAspectRatio="xMidYMid meet"
        >
            ${gridLines.join("")}
            ${axisLabels.join("")}
            <polygon points="${areaPoints}" class="earnings-chart__area" />
            ${bars}
            <polyline points="${linePoints}" class="earnings-chart__line" />
            ${markers}
        </svg>
    `;
}

function setMode(mode) {
    if (!authShell || !authCard) return;

    const normalizedMode = mode === 'signup' ? 'signup' : 'login';
    const isSignup = normalizedMode === 'signup';

    authShell.classList.toggle('is-signup', isSignup);
    authCard.dataset.mode = normalizedMode;

    authForms.forEach((form) => {
        const active = form.dataset.form === normalizedMode;
        form.classList.toggle('is-active', active);
        form.setAttribute('aria-hidden', String(!active));
    });

    modeButtons.forEach((button) => {
        const active = button.dataset.modeButton === normalizedMode;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
    });

    document.title = `CreatorSetu | ${isSignup ? 'Sign Up' : 'Login'}`;
}

function renderDashboard() {
    if (!barChart || !activityFeed) return;

    barChart.innerHTML = buildEarningsChart(earningsData);

    activityFeed.innerHTML = activityItems
        .map(
            (item) => `
                <article class="activity-item">
                    <div class="activity-item__top">
                        <span>${item.title}</span>
                        <span class="activity-item__badge">${item.badge}</span>
                    </div>
                    <p>${item.text}</p>
                    <p>${item.time}</p>
                </article>
            `
        )
        .join('');
}

modeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setMode(button.dataset.modeButton);
    });
});

function toTitleCase(value) {
    return value
        .split(/\s+/)
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

function getInitials(name) {
    const parts = name.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '';
    
    return (parts.length === 1
        ? parts[0].slice(0, 2)
        : parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function resolveName(form) {
    if (!form) return '';

    const nameInput = form.querySelector('input[name="signupName"]');
    if (nameInput && nameInput.value.trim()) {
        return toTitleCase(nameInput.value.trim());
    }

    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
        const localPart = emailInput.value.trim().split('@')[0].replace(/[._-]+/g, ' ');
        return toTitleCase(localPart);
    }

    return '';
}

function applyUserName(name) {
    if (!name) return;

    if (welcomeName) {
        welcomeName.textContent = name;
    }

    if (profileInitials) {
        const initials = getInitials(name);
        if (initials) profileInitials.textContent = initials;
    }
}

function showPostLogin(form) {
    if (!authShell || !dashboard) return;

    applyUserName(resolveName(form));

    authShell.hidden = false;
    authShell.classList.add('is-post-login');
    dashboard.hidden = false;
    dashboard.classList.add('is-visible');
    document.title = 'CreatorSetu | Dashboard';

    renderDashboard();
}

async function loadDashboard() {
    try {
        const response = await safeApiFetch("/api/dashboard");
        const data = await response.json();

        if (!data.success) return;

        const totalEarningsEl = document.getElementById("totalEarnings");
        if (totalEarningsEl) totalEarningsEl.textContent = "₹" + data.totalEarnings;

        const thisMonthEl = document.getElementById("thisMonth");
        if (thisMonthEl) thisMonthEl.textContent = "₹" + data.thisMonth;

        const topPlatformEl = document.getElementById("topPlatform");
        if (topPlatformEl) topPlatformEl.textContent = data.topPlatform;

        const topPlatformAmountEl = document.getElementById("topPlatformAmount");
        if (topPlatformAmountEl) topPlatformAmountEl.textContent = "₹" + data.topPlatformAmount;
    } catch (error) {
        console.error("Failed to load dashboard statistics:", error);
    }
}

async function loadChart() {
    try {
        const response = await safeApiFetch("/api/chart");

        if (!response.ok) {
            throw new Error(`Chart API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.error || "Chart data failed");
        }

        earningsData = data.chart || [];
        renderDashboard();
    } catch (error) {
        console.error("Failed to load chart:", error);
    }
}

window.showDashboard = function(form) {
    showPostLogin(form);
    loadDashboard(); 
    loadChart();
};

window.loadDashboard = loadDashboard;
window.loadChart = loadChart;

// Initialization
setMode('login');
renderDashboard();