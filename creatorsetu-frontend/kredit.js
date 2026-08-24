(function () {
    "use strict";

    const loanRequests = [
        {
            id: 1,
            name: "Priya Sharma",
            amount: 3000,
            purpose: "Equipment upgrade",
            description: "Need a ring light and tripod for better video quality.",
            timeline: "1 month",
            riskScore: "low",
            avatar: "PS"
        },
        {
            id: 2,
            name: "Rohan Mehta",
            amount: 1500,
            purpose: "Software subscription",
            description: "Annual Canva Pro for carousel designs.",
            timeline: "2 weeks",
            riskScore: "low",
            avatar: "RM"
        },
        {
            id: 3,
            name: "Ananya Das",
            amount: 5000,
            purpose: "Course or workshop",
            description: "Advanced video editing masterclass to level up content.",
            timeline: "2 months",
            riskScore: "medium",
            avatar: "AD"
        },
        {
            id: 4,
            name: "Kabir Singh",
            amount: 2000,
            purpose: "Marketing & ads",
            description: "Instagram ad campaign for new merch launch.",
            timeline: "1 month",
            riskScore: "medium",
            avatar: "KS"
        },
        {
            id: 5,
            name: "Meera Joshi",
            amount: 8000,
            purpose: "Content production",
            description: "Travel to shoot a location-based vlog series.",
            timeline: "3 months",
            riskScore: "high",
            avatar: "MJ"
        },
        {
            id: 6,
            name: "Arjun Patel",
            amount: 1200,
            purpose: "Emergency fund",
            description: "Laptop charger broke unexpectedly before a deadline.",
            timeline: "2 weeks",
            riskScore: "low",
            avatar: "AP"
        }
    ];

    const myLoans = [
        {
            borrower: "Priya Sharma",
            amount: 2000,
            repaid: 1400,
            total: 2000,
            status: "On track"
        },
        {
            borrower: "Rohan Mehta",
            amount: 1500,
            repaid: 1500,
            total: 1500,
            status: "Completed"
        },
        {
            borrower: "Ananya Das",
            amount: 1000,
            repaid: 300,
            total: 1000,
            status: "In progress"
        }
    ];

    const riskColors = {
        low: "#7c9e8a",
        medium: "#d4a855",
        high: "#c97a7a"
    };

    const riskLabels = {
        low: "Low Risk",
        medium: "Medium Risk",
        high: "High Risk"
    };

    const toggleBtns = document.querySelectorAll("[data-kredit-mode]");
    const panels = document.querySelectorAll("[data-kredit-panel]");
    const requestGrid = document.querySelector("[data-loan-requests]");
    const borrowForm = document.querySelector("[data-borrow-form]");
    const loansContainer = document.querySelector("[data-kredit-loans]");

    function formatCurrency(amount) {
        return "₹" + Number(amount).toLocaleString("en-IN");
    }

    function setMode(mode) {
        toggleBtns.forEach(function (btn) {
            const active = btn.dataset.kreditMode === mode;

            btn.classList.toggle("is-active", active);
            btn.setAttribute("aria-pressed", active ? "true" : "false");
        });

        panels.forEach(function (panel) {
            const active = panel.dataset.kreditPanel === mode;

            panel.classList.toggle(
                "kredit-panel--hidden",
                !active
            );
        });
    }

    toggleBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            setMode(btn.dataset.kreditMode);
        });
    });

    function renderRequests() {
        if (!requestGrid) {
            console.error("Loan request container not found.");
            return;
        }

        requestGrid.innerHTML = loanRequests.map(function (req) {
            return `
                <article class="kredit-card">

                    <div class="kredit-card__top">

                        <div
                            class="kredit-card__avatar"
                            style="background:${riskColors[req.riskScore]}"
                        >
                            ${req.avatar}
                        </div>

                        <div class="kredit-card__info">
                            <h3 class="kredit-card__name">
                                ${req.name}
                            </h3>

                            <span class="kredit-card__purpose">
                                ${req.purpose}
                            </span>
                        </div>

                    </div>

                    <p class="kredit-card__desc">
                        ${req.description}
                    </p>

                    <div class="kredit-card__meta">

                        <div class="kredit-card__amount">
                            <span class="kredit-card__amount-label">
                                Amount
                            </span>

                            <strong>
                                ${formatCurrency(req.amount)}
                            </strong>
                        </div>

                        <div class="kredit-card__timeline">
                            <span class="kredit-card__amount-label">
                                Repay in
                            </span>

                            <strong>
                                ${req.timeline}
                            </strong>
                        </div>

                    </div>

                    <div class="kredit-card__foot">

                        <span
                            class="kredit-risk-badge"
                            style="
                                background:${riskColors[req.riskScore]}20;
                                color:${riskColors[req.riskScore]};
                                border:1px solid ${riskColors[req.riskScore]}30;
                            "
                        >
                            ${riskLabels[req.riskScore]}
                        </span>

                        <button
                            class="primary-button kredit-lend-btn"
                            type="button"
                            data-lend-id="${req.id}"
                        >
                            Lend
                        </button>

                    </div>

                </article>
            `;
        }).join("");

        requestGrid
            .querySelectorAll("[data-lend-id]")
            .forEach(function (button) {

                button.addEventListener("click", function () {

                    button.textContent = "Lent ✓";
                    button.disabled = true;

                    button.classList.add(
                        "kredit-lend-btn--done"
                    );
                });

            });
    }

    function renderLoans() {
        if (!loansContainer) {
            return;
        }

        loansContainer.innerHTML = myLoans.map(function (loan) {

            const percentage = Math.round(
                (loan.repaid / loan.total) * 100
            );

            const barColor =
                percentage === 100
                    ? "#7c9e8a"
                    : percentage > 50
                        ? "#7c9e8a"
                        : "#d4a855";

            return `
                <div class="kredit-loan-row">

                    <div class="kredit-loan-row__info">

                        <strong>
                            ${loan.borrower}
                        </strong>

                        <span>
                            ${formatCurrency(loan.repaid)}
                            of
                            ${formatCurrency(loan.total)}
                            repaid
                        </span>

                    </div>

                    <div class="kredit-loan-row__bar-wrap">

                        <div class="progress-bar">
                            <span
                                style="
                                    width:${percentage}%;
                                    background:${barColor};
                                "
                            ></span>
                        </div>

                        <div class="kredit-loan-row__status">

                            <span
                                class="
                                    kredit-loan-status-badge
                                    ${percentage === 100
                                        ? "kredit-loan-status-badge--done"
                                        : "kredit-loan-status-badge--active"}
                                "
                            >
                                ${loan.status}
                            </span>

                            <span class="kredit-loan-pct">
                                ${percentage}%
                            </span>

                        </div>

                    </div>

                </div>
            `;
        }).join("");
    }

    if (borrowForm) {

        borrowForm.addEventListener("submit", function (event) {

            event.preventDefault();

            const formData = new FormData(borrowForm);

            const amount = formData.get("amount");
            const purpose = formData.get("purpose");
            const timeline = formData.get("timeline");
            const description = formData.get("description");

            if (!amount || !purpose || !timeline) {
                alert("Please fill in all required fields.");
                return;
            }

            loanRequests.unshift({
                id: Date.now(),
                name: "You",
                amount: Number(amount),
                purpose: purpose,
                description: description || "",
                timeline: timeline,
                riskScore: "low",
                avatar: "YO"
            });

            renderRequests();

            borrowForm.reset();

            setMode("lend");
        });
    }

    renderRequests();
    renderLoans();

    console.log("Kredit page loaded successfully.");

})();