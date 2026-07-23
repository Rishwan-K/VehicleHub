const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "vehicles", required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// One conversation per buyer per vehicle — reopening the chat reuses it.
conversationSchema.index({ vehicle: 1, buyer: 1 }, { unique: true });

const ConversationModel = mongoose.model("conversations", conversationSchema);
module.exports = ConversationModel;
