const express = require("express");

const app = express();

app.use(express.json());

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to CreatorSetu Backend");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "CreatorSetu API Working"
    });
});

const PORT = 5000;

app.post("/api/earnings", (req, res) => {

    const { platform, amount } = req.body;

    res.json({
        success: true,
        platform,
        amount,
        message: "Income Added Successfully"
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
