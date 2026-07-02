const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./firebase");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- HOME ----------------

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to CreatorSetu Backend"
    });
});

// ---------------- TEST ----------------

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CreatorSetu API Working"
    });
});

// ---------------- FIREBASE TEST ----------------

app.get("/api/test-firebase", async (req, res) => {
    try {

        const snapshot = await db.collection("earnings").limit(1).get();

        res.json({
            success: true,
            message: "Firebase Connected",
            documentsChecked: snapshot.size
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }
});

// ---------------- ADD EARNING ----------------

app.post("/api/earnings", async (req, res) => {

    try {

        const { platform, amount, date } = req.body;

        if (!platform || !amount) {

            return res.status(400).json({
                success: false,
                error: "Platform and Amount are required"
            });

        }

        const docRef = await db.collection("earnings").add({

            platform: platform.trim(),
            amount: Number(amount),
            createdAt: date ? new Date(date) : new Date()

        });

        res.status(201).json({
            success: true,
            id: docRef.id,
            message: "Earning Added Successfully"
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            error: err.message
        });

    }

});

// ---------------- GET EARNINGS ----------------

app.get("/api/earnings", async (req, res) => {

    try {

        const snapshot = await db
            .collection("earnings")
            .orderBy("createdAt", "desc")
            .get();

        const earnings = [];

        snapshot.forEach(doc => {

            earnings.push({

                id: doc.id,
                ...doc.data()

            });

        });

        res.json({

            success: true,
            count: earnings.length,
            earnings

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});

// ---------------- DELETE EARNING ----------------

app.delete("/api/earnings/:id", async (req, res) => {

    try {

        await db
            .collection("earnings")
            .doc(req.params.id)
            .delete();

        res.json({

            success: true,
            message: "Deleted Successfully"

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});

// ---------------- DASHBOARD ----------------

app.get("/api/dashboard", async (req, res) => {

    try {

        const snapshot = await db.collection("earnings").get();

        let totalEarnings = 0;
        let thisMonth = 0;

        const platformTotals = {};

        const now = new Date();

        snapshot.forEach(doc => {

            const data = doc.data();

            const amount = Number(data.amount) || 0;

            totalEarnings += amount;

            const created =
                data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt);

            if (
                created.getMonth() === now.getMonth() &&
                created.getFullYear() === now.getFullYear()
            ) {

                thisMonth += amount;

            }

            platformTotals[data.platform] =
                (platformTotals[data.platform] || 0) + amount;

        });

        const top =
            Object.entries(platformTotals)
            .sort((a, b) => b[1] - a[1])[0] || ["None", 0];

        res.json({

            success: true,
            totalEarnings,
            thisMonth,
            topPlatform: top[0],
            topPlatformAmount: top[1]

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});

// ---------------- CHART ----------------

app.get("/api/chart", async (req, res) => {

    try {

        const snapshot = await db.collection("earnings").get();

        const monthly = {};

        snapshot.forEach(doc => {

            const data = doc.data();

            const created =
                data.createdAt?.toDate
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt);

            const month = created.toLocaleString("en-US", {
                month: "short"
            });

            monthly[month] =
                (monthly[month] || 0) + Number(data.amount);

        });

        const chart = Object.keys(monthly).map(month => ({

            month,
            value: monthly[month]

        }));

        res.json({

            success: true,
            chart

        });

    } catch (err) {

        res.status(500).json({

            success: false,
            error: err.message

        });

    }

});

// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 CreatorSetu Backend running on port ${PORT}`);

});