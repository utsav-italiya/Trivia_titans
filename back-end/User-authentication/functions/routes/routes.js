const express = require("express");
const router = express.Router();
const QuestionsController = require("../controllers/authController");


router.post("/store-user-response", QuestionsController.storeUserResponse);
router.post("/validate-answer", QuestionsController.validateUserResponse);

module.exports = { router };
