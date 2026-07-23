const mongoose = require("mongoose");

// Only two roles: "admin" (moderates the platform) and "user" (a regular
// account that can BOTH list vehicles for sale and chat/buy from others —
// there's no separate buyer/seller account type, same as OLX.
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    location: { type: String }, // e.g. "Coimbatore, Tamil Nadu" — prefills new listings
    role: {
      type: String,
      enum: ["admin", "user"],
      required: true,
      default: "user",
    },
    isBlocked: {
      // admin can block an abusive account; blocked users can't log in
      type: Boolean,
      default: false,
    },
    otp: { type: String },
    otpExpiry: { type: Date },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
