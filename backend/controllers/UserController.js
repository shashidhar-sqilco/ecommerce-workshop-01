const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//post req to signup a user
router.post("/signup", async (req, res) => {
  try {
    //taking fullname,email,passoword from req.body
    const { fullname, email, password } = req.body;
    console.log(fullname, email, password);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    //creating a new user
    const user = new User({ fullname, email, password: hashedPassword });
    //saving user into db
    await user.save();
    //generating jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 36000000, // 1hr in milli secs
    });

    res.status(201).json({ token, userId: user._id });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

//route to login a user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    //check if user exists in our db
    const user = await User.findOne({ email });
    console.log(user);

    //if user not found
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //check if the password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);

    //If password is wrong -> Invalid credentials
    if (!isCorrectPassword) {
      return res.status(400).json({ messsage: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 36000000, // 1hr in milli secs
    });

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user information" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
