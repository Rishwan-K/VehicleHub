const mongoose = require("mongoose");

const dbURL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURL);
    console.log("Connected to DB");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
