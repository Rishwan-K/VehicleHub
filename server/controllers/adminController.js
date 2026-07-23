const Vehicle = require("../models/vehicleModel");
const User = require("../models/userModel");

const listAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).populate("seller", "name email").sort({ createdAt: -1 });
    res.send({ success: true, message: "All listings fetched", data: vehicles });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Soft-remove: takes a listing off the public marketplace without deleting
// the data, e.g. for a reported/inappropriate listing.
const removeVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, { status: "removed" }, { new: true });
    if (!vehicle) return res.status(404).send({ success: false, message: "Listing not found" });
    res.send({ success: true, message: "Listing removed from the marketplace", data: vehicle });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const listUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.send({ success: true, message: "Users fetched", data: users });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const setUserBlocked = async (req, res) => {
  try {
    const { blocked } = req.body; // true | false
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: !!blocked }, { new: true }).select(
      "-password"
    );
    if (!user) return res.status(404).send({ success: false, message: "User not found" });
    res.send({ success: true, message: blocked ? "User blocked" : "User unblocked", data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = { listAllVehicles, removeVehicle, listUsers, setUserBlocked };
