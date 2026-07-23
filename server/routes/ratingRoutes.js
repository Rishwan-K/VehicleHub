const express = require("express");
const { submitRating, getRatingsForUser } = require("../controllers/ratingController");
const authMiddleware = require("../middlewares/authMiddleware");

const ratingRouter = express.Router();

ratingRouter.post("/", authMiddleware, submitRating);
ratingRouter.get("/user/:userId", getRatingsForUser); // public

module.exports = ratingRouter;
