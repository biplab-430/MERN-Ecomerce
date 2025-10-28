const express = require("express");
const router = express.Router();
const { chatbotHelp } = require("../../controllers/Chat/Chatbot");
const {orderChatbotHelp} = require("../../controllers/Chat/Order-Chatbot")

// ✅ POST route for chatbot help
router.post("/help", chatbotHelp);
router.post("/order-help",orderChatbotHelp );

module.exports = router;
