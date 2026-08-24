require("dotenv").config();

const env = require("./config/env");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- ROUTES ----------------

const testRoutes = require("./routes/test.routes");
const earningsRoutes = require("./routes/earnings.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const chartRoutes = require("./routes/chart.routes");
const strategyRoutes = require("./routes/strategy.routes");
app.use("/api/test", testRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chart", chartRoutes);
app.use("/api/strategy", strategyRoutes);

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

// ---------------- ERROR MIDDLEWARE ----------------

const errorMiddleware = require("./middleware/error.middleware");

app.use(errorMiddleware);

// ---------------- START SERVER ----------------

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 CreatorSetu Backend running on port ${PORT}`);
});