const mongoose = require("mongoose");

const connectTODb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the MongoDB successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

module.exports = connectTODb;
