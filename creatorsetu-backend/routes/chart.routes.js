const express = require("express");
const prisma = require("../prisma/lib/prisma");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const earnings = await prisma.earning.findMany({
            orderBy: {
                date: "asc"
            }
        });

        const monthly = {};

        earnings.forEach((earning) => {
            const date = new Date(earning.date);

            const month = date.toLocaleString("en-US", {
                month: "short"
            });

            monthly[month] =
                (monthly[month] || 0) + Number(earning.amount || 0);
        });

        const chart = Object.entries(monthly).map(
            ([month, value]) => ({
                month,
                value
            })
        );

        res.json({
            success: true,
            chart
        });

    } catch (error) {
        console.error("Chart error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;