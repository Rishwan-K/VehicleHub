const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateMyProfile,
  getPublicProfile,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-current-user", authMiddleware, getCurrentUser);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.put("/me", authMiddleware, updateMyProfile);
userRouter.get("/:id/profile", getPublicProfile); // public — no auth required

module.exports = userRouter;
