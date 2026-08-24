const { getEarningsData } = require("../services/earnings.service");

const getEarnings = (req, res) => {
    const data = getEarningsData();

    res.json({
        success: true,
        message: data
    });
};

module.exports = {
    getEarnings
};