const express = require("express");
const testController = require("../controllers/test.controller");
const validate = require("../middleware/validate.middleware");
const { testSchema } = require("../config/validation");

const router = express.Router();

router.post("/", validate(testSchema), testController);

module.exports = router;