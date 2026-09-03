const strategyForm = document.querySelector("[data-strategy-form]");
const strategyInputs = document.querySelectorAll("[data-strategy-input]");
const postsRange = document.querySelector("[data-posts-range]");
const postsValueEl = document.querySelector("[data-posts-value]");
const suggestionGrid = document.querySelector("[data-suggestion-grid]");
const advisorContext = document.querySelector("[data-advisor-context]");
const bestContentEl = document.querySelector("[data-best-content]");
const postsPaceEl = document.querySelector("[data-posts-pace]");


// ===============================
// PLATFORM TIPS
// ===============================

const PLATFORM_TIPS = {
    Instagram: [
        {
            emoji: "🎬",
            title: "Hook in 1.5 seconds",
            desc: "Open Reels with motion or a bold question so viewers stop scrolling."
        },
        {
            emoji: "🗂️",
            title: "Create save-worthy content",
            desc: "Turn your best advice into useful carousel posts people want to save."
        },
        {
            emoji: "💬",
            title: "Reply with a Reel",
            desc: "Turn interesting comments into short videos to increase engagement."
        }
    ],

    YouTube: [
        {
            emoji: "🔍",
            title: "Improve your titles",
            desc: "Use clear keywords and curiosity to make people want to click."
        },
        {
            emoji: "⏱️",
            title: "Focus on the first 30 seconds",
            desc: "Deliver value quickly so viewers stay longer."
        },
        {
            emoji: "🧩",
            title: "Create content series",
            desc: "Turn related videos into a series so viewers watch multiple videos."
        }
    ],

    Pinterest: [
        {
            emoji: "📌",
            title: "Create fresh pins",
            desc: "Repurpose your existing content into new visual pins."
        },
        {
            emoji: "🎨",
            title: "Use vertical designs",
            desc: "Use clear headlines and vertical layouts."
        },
        {
            emoji: "🔑",
            title: "Use keywords",
            desc: "Treat Pinterest like a search engine and optimize your boards."
        }
    ],

    TikTok: [
        {
            emoji: "🔥",
            title: "Use trends intelligently",
            desc: "Connect trending sounds with your own niche."
        },
        {
            emoji: "🔁",
            title: "Create loopable videos",
            desc: "Use endings that naturally encourage viewers to watch again."
        },
        {
            emoji: "✍️",
            title: "Use captions",
            desc: "Keep important information visible through on-screen text."
        }
    ],

    Behance: [
        {
            emoji: "🖼️",
            title: "Lead with your best work",
            desc: "Use your strongest visual as the project cover."
        },
        {
            emoji: "🧵",
            title: "Show your process",
            desc: "Show sketches, iterations and the final result."
        },
        {
            emoji: "🏷️",
            title: "Use relevant tags",
            desc: "Help potential clients discover your work."
        }
    ]
};


// ===============================
// BEST CONTENT
// ===============================

const seedBestContent = [
    {
        label: "Top Reel",
        value: "“5 budgeting hacks”",
        meta: "48K views"
    },
    {
        label: "Best Carousel",
        value: "“Creator tax 101”",
        meta: "3.2K saves"
    },
    {
        label: "Most shared",
        value: "“My setup tour”",
        meta: "1.1K shares"
    },
    {
        label: "Top comment driver",
        value: "“Ask me anything”",
        meta: "420 comments"
    }
];


// ===============================
// CADENCE
// ===============================

function getPaceLabel(count) {

    if (count <= 2) {
        return "Light & easy";
    }

    if (count <= 4) {
        return "Steady pace";
    }

    if (count <= 6) {
        return "High output";
    }

    return "Daily grind";
}


// ===============================
// DEFAULT SUGGESTIONS
// ===============================

function renderSuggestions() {

    if (!strategyForm || !postsRange || !suggestionGrid) {
        return;
    }

    const platform =
        strategyForm.querySelector('[name="platform"]').value;

    const posts = Number(postsRange.value);

    const contentType = "Reels & Shorts";

    if (advisorContext) {
        advisorContext.textContent =
            `${platform} • ${contentType} • ${posts} ${
                posts === 1 ? "post" : "posts"
            }/week`;
    }

    const cards = [];

    const platformTips =
        PLATFORM_TIPS[platform] || [];

    platformTips.forEach((tip) => {
        cards.push(tip);
    });

    suggestionGrid.innerHTML = cards
        .map(
            (tip, index) => `
                <article class="idea-card idea-card--tone-${index % 4}">

                    <span class="idea-card__emoji">
                        ${tip.emoji}
                    </span>

                    <h3 class="idea-card__title">
                        ${tip.title}
                    </h3>

                    <p class="idea-card__desc">
                        ${tip.desc}
                    </p>

                </article>
            `
        )
        .join("");
}


// ===============================
// BEST CONTENT
// ===============================

function renderBestContent() {

    if (!bestContentEl) {
        return;
    }

    bestContentEl.innerHTML =
        seedBestContent
            .map(
                (item) => `
                    <div class="stat-chip">

                        <span class="stat-chip__label">
                            ${item.label}
                        </span>

                        <strong class="stat-chip__value">
                            ${item.value}
                        </strong>

                        <span class="stat-chip__meta">
                            ${item.meta}
                        </span>

                    </div>
                `
            )
            .join("");
}


// ===============================
// SLIDER
// ===============================

function syncSlider() {

    if (!postsRange) {
        return;
    }

    const value = Number(postsRange.value);

    if (postsValueEl) {
        postsValueEl.textContent = value;
    }

    if (postsPaceEl) {
        postsPaceEl.textContent =
            getPaceLabel(value);
    }

    const percentage =
        ((value - 1) / 6) * 100;

    postsRange.style.setProperty(
        "--fill",
        percentage + "%"
    );

    renderSuggestions();
}


if (postsRange) {
    postsRange.addEventListener(
        "input",
        syncSlider
    );
}


// ===============================
// INPUT CHANGES
// ===============================

strategyInputs.forEach((input) => {

    if (input === postsRange) {
        return;
    }

    input.addEventListener(
        "change",
        renderSuggestions
    );

});


// ===============================
// GENERATE IDEAS
// ===============================

if (strategyForm) {

    strategyForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const formData =
                new FormData(strategyForm);

            const strategyData = {

                platform:
                    formData.get("platform"),

                contentType:
                    "Reels & Shorts",

                niche:
                    formData.get("niche"),

                goal:
                    formData.get("goal"),

                postsPerWeek:
                    Number(
                        formData.get("postsPerWeek")
                    )
            };

            console.log(
                "Strategy data:",
                strategyData
            );

            suggestionGrid.innerHTML =
                "<p>Generating ideas...</p>";

            try {

                const response =
                    await apiFetch(
                         "/api/strategy/generate", 
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    strategyData
                                )
                        }
                    );

                const data =
                    await response.json();

                if (
                    !response.ok ||
                    !data.success
                ) {
                    throw new Error(
                        data.error ||
                        "Failed to generate ideas"
                    );
                }

                renderStrategyIdeas(
                    data.ideas,
                    data.context
                );

            } catch (error) {

                console.error(
                    "Strategy error:",
                    error
                );

                suggestionGrid.innerHTML =
                    "<p>Could not generate ideas. Make sure backend is running.</p>";
            }
        }
    );
}


// ===============================
// RENDER GENERATED IDEAS
// ===============================

function renderStrategyIdeas(
    ideas,
    context
) {

    if (!ideas || !suggestionGrid) {
        return;
    }

    if (advisorContext && context) {

        advisorContext.textContent =
            `${context.niche} ideas for ${context.platform} · ${context.postsPerWeek} posts/week`;
    }

    suggestionGrid.innerHTML =
        ideas
            .map(
                (idea) => `
                    <article class="suggestion-card">

                        <div class="suggestion-card__top">

                            <span>
                                ${idea.platform}
                            </span>

                            <span>
                                ${idea.format}
                            </span>

                        </div>

                        <h3>
                            ${idea.title}
                        </h3>

                        <p>
                            <strong>Hook:</strong>
                            ${idea.hook}
                        </p>

                        <p>
                            <strong>Goal:</strong>
                            ${idea.goal}
                        </p>

                        <button
                            type="button"
                            class="primary-button strategy-generate-script"
                            data-title="${idea.title}"
                            data-hook="${idea.hook}">
                            Generate Script
                        </button>

                    </article>
                `
            )
            .join("");
}


// ===============================
// SCRIPT MODAL
// ===============================

document.addEventListener(
    "click",
    async (event) => {

        const button =
            event.target.closest(
                ".strategy-generate-script"
            );

        if (!button) {
            return;
        }

        const title =
            button.dataset.title;

        const hook =
            button.dataset.hook;

        const scriptModal =
            document.getElementById(
                "scriptModal"
            );

        const scriptModalTitle =
            document.getElementById(
                "scriptModalTitle"
            );

        const generatedScript =
            document.getElementById(
                "generatedScript"
            );

        if (
            !scriptModal ||
            !scriptModalTitle ||
            !generatedScript
        ) {
            return;
        }

        scriptModalTitle.textContent =
            title;

        generatedScript.textContent =
            "Generating script...";

        scriptModal.classList.add(
            "is-open"
        );

        scriptModal.style.display =
            "flex";

        try {

            const response =
                await apiFetch(
                    "/api/strategy/script",
                    
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                title,
                                hook
                            })
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.error ||
                    "Failed to generate script"
                );
            }

            generatedScript.textContent =
                data.script;

        } catch (error) {

            console.error(
                "Script generation error:",
                error
            );

            generatedScript.textContent =
                "Could not generate script.";
        }
    }
);


// ===============================
// CLOSE MODAL
// ===============================

const closeScriptModal =
    document.getElementById(
        "closeScriptModal"
    );

const scriptModal =
    document.getElementById(
        "scriptModal"
    );

if (
    closeScriptModal &&
    scriptModal
) {

    closeScriptModal.addEventListener(
        "click",
        () => {

            scriptModal.classList.remove(
                "is-open"
            );

            scriptModal.style.display =
                "none";
        }
    );
}


// ===============================
// COPY SCRIPT
// ===============================

const copyScriptBtn =
    document.getElementById(
        "copyScriptBtn"
    );

if (copyScriptBtn) {

    copyScriptBtn.addEventListener(
        "click",
        async () => {

            const generatedScript =
                document.getElementById(
                    "generatedScript"
                );

            if (!generatedScript) {
                return;
            }

            const script =
                generatedScript.textContent;

            try {

                await navigator.clipboard
                    .writeText(script);

                copyScriptBtn.textContent =
                    "Copied ✓";

                setTimeout(() => {

                    copyScriptBtn.textContent =
                        "Copy Script";

                }, 1500);

            } catch (error) {

                console.error(
                    "Copy failed:",
                    error
                );
            }
        }
    );
}


// ===============================
// INITIAL LOAD
// ===============================

syncSlider();
renderSuggestions();
renderBestContent();