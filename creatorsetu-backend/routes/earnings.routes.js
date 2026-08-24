const express = require("express");
const prisma = require("../prisma/lib/prisma");

const router = express.Router();

// GET all earnings
router.get("/", async (req, res) => {
    try {
        const earnings = await prisma.earning.findMany({
            orderBy: {
                date: "desc"
            }
        });

        res.json({
            success: true,
            count: earnings.length,
            earnings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ADD earning
// ADD earning
router.post("/", async (req, res) => {
    try {
        const { platform, amount, date } = req.body;

        if (!platform || amount === undefined) {
            return res.status(400).json({
                success: false,
                error: "Platform and amount are required"
            });
        }

        const platformName = platform.trim().toLowerCase();

        let normalizedPlatform;

        if (platformName === "instagram") {
            normalizedPlatform = "Instagram";
        } else if (platformName === "youtube") {
            normalizedPlatform = "YouTube";
        } else {
            normalizedPlatform = platform.trim();
        }

        const earning = await prisma.earning.create({
            data: {
                platform: normalizedPlatform,
                amount: Number(amount),
                date: date ? new Date(date) : new Date()
            }
        });

        res.status(201).json({
            success: true,
            message: "Earning added successfully",
            earning
        });

    } catch (error) {
        console.error("Add earning error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE earning
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        await prisma.earning.delete({
            where: {
                id: id
            }
        });

        res.json({
            success: true,
            message: "Earning deleted successfully"
        });

    } catch (error) {
        console.error("Delete earning error:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;