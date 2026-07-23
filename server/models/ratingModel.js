const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    ratedUser: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // who the rating is ABOUT
    ratedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true }, // who WROTE the rating
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "vehicles" }, // optional context, e.g. "as a seller for this car"
    stars: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// One rating per (rater, ratee, vehicle) combo — stops someone spamming
// 20 five-star reviews on the same deal, while still allowing a rating per
// vehicle if the same two people transact more than once.
ratingSchema.index({ ratedUser: 1, ratedBy: 1, vehicle: 1 }, { unique: true });

const RatingModel = mongoose.model("ratings", ratingSchema);
module.exports = RatingModel;
