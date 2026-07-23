const Conversation = require("../models/conversationModel");
const Message = require("../models/messageModel");
const Vehicle = require("../models/vehicleModel");
const { getIO } = require("../socket");

// Buyer taps "Chat with Seller" on a vehicle — finds the existing thread for
// this (vehicle, buyer) pair or creates a new one.
const startConversation = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    if (!vehicleId) return res.status(400).send({ success: false, message: "vehicleId is required" });

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) return res.status(404).send({ success: false, message: "Vehicle not found" });

    if (String(vehicle.seller) === String(req.user.userId)) {
      return res.status(400).send({ success: false, message: "You can't start a chat on your own listing" });
    }

    let conversation = await Conversation.findOne({ vehicle: vehicleId, buyer: req.user.userId });
    if (!conversation) {
      conversation = await Conversation.create({
        vehicle: vehicleId,
        buyer: req.user.userId,
        seller: vehicle.seller,
      });
    }

    conversation = await conversation.populate([
      { path: "vehicle", select: "title images price" },
      { path: "buyer", select: "name" },
      { path: "seller", select: "name" },
    ]);

    res.send({ success: true, message: "Conversation ready", data: conversation });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    if (!conversationId || !text?.trim()) {
      return res.status(400).send({ success: false, message: "conversationId and text are required" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).send({ success: false, message: "Conversation not found" });

    const isParticipant =
      String(conversation.buyer) === String(req.user.userId) ||
      String(conversation.seller) === String(req.user.userId);
    if (!isParticipant) {
      return res.status(403).send({ success: false, message: "You're not part of this conversation" });
    }

    const message = await Message.create({
      conversation: conversationId,
      sender: req.user.userId,
      text: text.trim(),
    });

    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populatedMessage = await message.populate("sender", "name");

    // Real-time push to anyone with this conversation open right now.
    try {
      getIO().to(`chat:${conversationId}`).emit("new-message", populatedMessage);
    } catch (e) {
      // Socket layer not initialized (e.g. in a unit test) — message is still saved.
    }

    res.send({ success: true, message: "Message sent", data: populatedMessage });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getMyConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ buyer: req.user.userId }, { seller: req.user.userId }],
    })
      .populate("vehicle", "title images price status")
      .populate("buyer", "name")
      .populate("seller", "name")
      .sort({ lastMessageAt: -1 });

    res.send({ success: true, message: "Conversations fetched", data: conversations });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) return res.status(404).send({ success: false, message: "Conversation not found" });

    const isParticipant =
      String(conversation.buyer) === String(req.user.userId) ||
      String(conversation.seller) === String(req.user.userId);
    if (!isParticipant) {
      return res.status(403).send({ success: false, message: "You're not part of this conversation" });
    }

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name")
      .sort({ createdAt: 1 })
      .limit(200);

    res.send({ success: true, message: "Messages fetched", data: messages });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { startConversation, sendMessage, getMyConversations, getMessages };
