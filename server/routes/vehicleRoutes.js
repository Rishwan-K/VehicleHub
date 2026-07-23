const express = require("express");
const {
  createListing,
  updateListing,
  markAsSold,
  deleteListing,
  getVehicleById,
  searchVehicles,
  getMyListings,
  getDistinctLocations,
} = require("../controllers/vehicleController");
const authMiddleware = require("../middlewares/authMiddleware");

const vehicleRouter = express.Router();

// Public — anyone can browse/search/view listings without logging in, like OLX.
vehicleRouter.get("/search", searchVehicles);
vehicleRouter.get("/locations", getDistinctLocations);
vehicleRouter.get("/:id", getVehicleById);

// Authenticated — posting/managing your own listings.
vehicleRouter.post("/", authMiddleware, createListing);
vehicleRouter.get("/mine/all", authMiddleware, getMyListings);
vehicleRouter.put("/:id", authMiddleware, updateListing);
vehicleRouter.patch("/:id/sold", authMiddleware, markAsSold);
vehicleRouter.delete("/:id", authMiddleware, deleteListing);

module.exports = vehicleRouter;
