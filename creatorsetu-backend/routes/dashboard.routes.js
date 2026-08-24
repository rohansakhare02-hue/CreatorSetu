const express = require("express");
const prisma = require("../prisma/lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const earnings = await prisma.earning.findMany({
            orderBy: {
                date: "desc"
            }
        });

        // Total earnings
        const totalEarnings = earnings.reduce(
            (sum, item) => sum + Number(item.amount),
            0
        );

        // This month's earnings
        const now = new Date();

        const thisMonth = earnings
            .filter((item) => {
                const date = new Date(item.date);

                return (
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
                );
            })
            .reduce(
                (sum, item) => sum + Number(item.amount),
                0
            );

        // Earnings by platform
        const platformTotals = {};

        earnings.forEach((item) => {
            const platform = item.platform;

            platformTotals[platform] =
                (platformTotals[platform] || 0) +
                Number(item.amount);
        });

        // Find top platform
        let topPlatform = "None";
        let topPlatformAmount = 0;

        Object.entries(platformTotals).forEach(
            ([platform, amount]) => {
                if (amount > topPlatformAmount) {
                    topPlatform = platform;
                    topPlatformAmount = amount;
                }
            }
        );

        res.json({
            success: true,
            totalEarnings,
            thisMonth,
            topPlatform,
            topPlatformAmount
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;