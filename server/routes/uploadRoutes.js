const express = require("express");
const upload = require("../middlewares/uploadMiddleware");
const authMiddleware = require("../middlewares/authMiddleware");

const uploadRouter = express.Router();

const isCloudinaryConfigured = () =>
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== "your_cloud_name" &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== "your_api_key" &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== "your_api_secret";

// Accepts up to 8 photos per listing in one request (field name "images").
uploadRouter.post("/images", authMiddleware, (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(400).send({
      success: false,
      message:
        "Image upload isn't configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env, then restart the server.",
    });
  }

  upload.array("images", 8)(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).send({ success: false, message: err.message || "Image upload failed" });
    }
    if (!req.files || !req.files.length) {
      return res.status(400).send({ success: false, message: "No image files received" });
    }

    res.status(200).send({
      success: true,
      message: "Images uploaded successfully",
      data: { urls: req.files.map((f) => f.path) },
    });
  });
});

module.exports = uploadRouter;
