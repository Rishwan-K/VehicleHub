const Vehicle = require("../models/vehicleModel");

const createListing = async (req, res) => {
  try {
    const { title, brand, model, year, price, category, fuelType, kmDriven, condition, description, images, location } =
      req.body;

    if (!title || !brand || !model || !year || !price || !category) {
      return res.status(400).send({
        success: false,
        message: "title, brand, model, year, price, and category are required",
      });
    }

    const vehicle = await Vehicle.create({
      title,
      brand,
      model,
      year,
      price,
      category,
      fuelType,
      kmDriven,
      condition,
      description,
      images: Array.isArray(images) ? images : [],
      location,
      seller: req.user.userId,
    });

    res.status(201).send({ success: true, message: "Listing created", data: vehicle });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const updateListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send({ success: false, message: "Listing not found" });

    const isOwner = String(vehicle.seller) === String(req.user.userId);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).send({ success: false, message: "You can only edit your own listings" });
    }

    const editableFields = [
      "title",
      "brand",
      "model",
      "year",
      "price",
      "category",
      "fuelType",
      "kmDriven",
      "condition",
      "description",
      "images",
      "location",
    ];
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) vehicle[field] = req.body[field];
    });

    await vehicle.save();
    res.send({ success: true, message: "Listing updated", data: vehicle });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const markAsSold = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send({ success: false, message: "Listing not found" });

    const isOwner = String(vehicle.seller) === String(req.user.userId);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).send({ success: false, message: "You can only update your own listings" });
    }

    vehicle.status = "sold";
    await vehicle.save();
    res.send({ success: true, message: "Marked as sold", data: vehicle });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const deleteListing = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).send({ success: false, message: "Listing not found" });

    const isOwner = String(vehicle.seller) === String(req.user.userId);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).send({ success: false, message: "You can only delete your own listings" });
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.send({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("seller", "name email phone");

    if (!vehicle) return res.status(404).send({ success: false, message: "Listing not found" });
    res.send({ success: true, message: "Listing fetched", data: vehicle });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Public browse/search endpoint — supports the search bar + category/price/brand/year/location filters.
const searchVehicles = async (req, res) => {
  try {
    const { q, category, brand, minPrice, maxPrice, minYear, maxYear, location, sort, page, limit } = req.query;

    const query = { status: "active" };
    if (category) query.category = category;
    if (brand) query.brand = { $regex: brand, $options: "i" };
    if (location) query.location = { $regex: location, $options: "i" };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = Number(minYear);
      if (maxYear) query.year.$lte = Number(maxYear);
    }
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    const sortMap = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      year_desc: { year: -1 },
      newest: { createdAt: -1 },
    };
    const sortBy = sortMap[sort] || sortMap.newest;

    const pageNum = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(50, Number(limit) || 12);

    const [vehicles, total] = await Promise.all([
      Vehicle.find(query)
        .populate("seller", "name")
        .sort(sortBy)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      Vehicle.countDocuments(query),
    ]);

    res.send({
      success: true,
      message: "Listings fetched",
      data: vehicles,
      pagination: { page: pageNum, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Powers the location filter dropdown with real values already in use,
// instead of a hardcoded city list that may not match what sellers actually typed.
const getDistinctLocations = async (req, res) => {
  try {
    const locations = await Vehicle.distinct("location", { status: "active", location: { $ne: "" } });
    res.send({ success: true, message: "Locations fetched", data: locations.sort() });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getMyListings = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ seller: req.user.userId }).sort({ createdAt: -1 });
    res.send({ success: true, message: "Your listings fetched", data: vehicles });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  createListing,
  updateListing,
  markAsSold,
  deleteListing,
  getVehicleById,
  searchVehicles,
  getMyListings,
  getDistinctLocations,
};
