const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: "conversations", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

messageSchema.index({ conversation: 1, createdAt: 1 });

const MessageModel = mongoose.model("messages", messageSchema);
module.exports = MessageModel;
