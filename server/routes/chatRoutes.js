const express = require("express");
const {
  startConversation,
  sendMessage,
  getMyConversations,
  getMessages,
} = require("../controllers/chatController");
const authMiddleware = require("../middlewares/authMiddleware");

const chatRouter = express.Router();

chatRouter.post("/start", authMiddleware, startConversation);
chatRouter.post("/message", authMiddleware, sendMessage);
chatRouter.get("/conversations", authMiddleware, getMyConversations);
chatRouter.get("/:conversationId/messages", authMiddleware, getMessages);

module.exports = chatRouter;
