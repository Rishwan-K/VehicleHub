const User = require("../models/userModel");
const Rating = require("../models/ratingModel");
const Vehicle = require("../models/vehicleModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const emailHelper = require("../utils/emailHelper");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({ success: false, message: "name, email, and password are required" });
    }

    const userExists = await User.findOne({ email: email.trim().toLowerCase() });
    if (userExists) {
      return res.status(400).send({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // role is always "user" here — admins are created directly in the DB,
    // never through public registration.
    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      phone,
      role: "user",
    });
    await newUser.save();

    res.status(201).send({ success: true, message: "Registered successfully, please login" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").trim().toLowerCase() });

    if (!user) {
      return res.status(400).send({ success: false, message: "User doesn't exist, please register" });
    }
    if (user.isBlocked) {
      return res.status(403).send({ success: false, message: "This account has been blocked. Contact support." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({ success: true, message: "Logged in successfully", data: token });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).send({ success: false, message: "User not found" });
    res.status(200).send({ success: true, message: "You are authorized", data: user });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is required" });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    if (user.otp && Date.now() < user.otpExpiry) {
      return res.status(400).send({ success: false, message: "Please use the OTP already sent" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    await emailHelper("otp.html", user.email, { name: user.name, otp });

    res.status(200).send({ success: true, message: "OTP has been sent to your email" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, otp } = req.body;

    if (!password || !confirmPassword || !otp) {
      return res.status(400).send({ success: false, message: "Invalid request" });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({ otp });
    if (!user) {
      return res.status(404).send({ success: false, message: "Invalid OTP" });
    }
    if (Date.now() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      return res.status(400).send({ success: false, message: "OTP expired, please request a new one" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).send({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Update your OWN profile (name/phone/location) — not email/password/role.
const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, location } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (location !== undefined) user.location = location;
    await user.save();

    const safeUser = await User.findById(user._id).select("-password");
    res.send({ success: true, message: "Profile updated", data: safeUser });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

// Public profile — anyone can view another user's name, location, rating
// summary, and active listings. Never exposes email/phone/password to strangers.
const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name location createdAt");
    if (!user) return res.status(404).send({ success: false, message: "User not found" });

    const [ratingAgg, listings] = await Promise.all([
      Rating.aggregate([
        { $match: { ratedUser: user._id } },
        { $group: { _id: null, average: { $avg: "$stars" }, count: { $sum: 1 } } },
      ]),
      Vehicle.find({ seller: user._id, status: "active" }).sort({ createdAt: -1 }),
    ]);

    const ratingSummary = ratingAgg[0]
      ? { average: Math.round(ratingAgg[0].average * 10) / 10, count: ratingAgg[0].count }
      : { average: null, count: 0 };

    res.send({
      success: true,
      message: "Profile fetched",
      data: { user, rating: ratingSummary, listings },
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateMyProfile,
  getPublicProfile,
};
