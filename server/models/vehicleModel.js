const mongoose = require("mongoose");

const VEHICLE_CATEGORIES = ["Car", "Bike", "Truck", "Bus", "Auto Rickshaw", "Other"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric", "CNG", "Other"];
const CONDITIONS = ["New", "Used"];

const vehicleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true }, // e.g. Maruti, Honda, Royal Enfield
    model: { type: String, required: true, trim: true }, // e.g. Swift, Activa
    year: { type: Number, required: true },
    price: { type: Number, required: true },
    category: { type: String, enum: VEHICLE_CATEGORIES, required: true },
    fuelType: { type: String, enum: FUEL_TYPES },
    kmDriven: { type: Number },
    condition: { type: String, enum: CONDITIONS, default: "Used" },
    description: { type: String, default: "" },
    images: { type: [String], default: [] }, // Cloudinary URLs
    location: { type: String, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    status: {
      type: String,
      enum: ["active", "sold", "removed"], // "removed" = admin took it down
      default: "active",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Speeds up the common search/filter combinations and lets $text search work.
vehicleSchema.index({ title: "text", brand: "text", model: "text", description: "text" });
vehicleSchema.index({ category: 1, brand: 1, year: 1, price: 1, status: 1 });

const VehicleModel = mongoose.model("vehicles", vehicleSchema);
module.exports = VehicleModel;
module.exports.VEHICLE_CATEGORIES = VEHICLE_CATEGORIES;
module.exports.FUEL_TYPES = FUEL_TYPES;
module.exports.CONDITIONS = CONDITIONS;
