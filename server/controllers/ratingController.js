const Rating = require("../models/ratingModel");
const User = require("../models/userModel");

const submitRating = async (req, res) => {
  try {
    const { ratedUserId, vehicleId, stars, comment } = req.body;

    if (!ratedUserId || !stars) {
      return res.status(400).send({ success: false, message: "ratedUserId and stars are required" });
    }
    if (stars < 1 || stars > 5) {
      return res.status(400).send({ success: false, message: "stars must be between 1 and 5" });
    }
    if (String(ratedUserId) === String(req.user.userId)) {
      return res.status(400).send({ success: false, message: "You can't rate yourself" });
    }

    const ratedUserExists = await User.findById(ratedUserId);
    if (!ratedUserExists) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    const rating = await Rating.findOneAndUpdate(
      { ratedUser: ratedUserId, ratedBy: req.user.userId, vehicle: vehicleId || null },
      { stars, comment: comment || "" },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.send({ success: true, message: "Rating submitted", data: rating });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getRatingsForUser = async (req, res) => {
  try {
    const ratings = await Rating.find({ ratedUser: req.params.userId })
      .populate("ratedBy", "name")
      .populate("vehicle", "title")
      .sort({ createdAt: -1 });

    res.send({ success: true, message: "Ratings fetched", data: ratings });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { submitRating, getRatingsForUser };
