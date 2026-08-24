const testService = require("../services/test.service");

const testController = (req, res) => {
    const message = testService();

    res.json({
        success: true,
        message: message
    });
};

module.exports = testController;