// routes/userRoutes.js
const express = require("express");
const User = require("../models/User");
const router = express.Router();

// Test endpoint
router.get("/test", (req, res) => {
  res.json({ message: " User routes loaded!" });
});

// Register
router.post("/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ success: true, user: { username, email } });
  } catch (err) {
    console.error(" Register error:", err.message || err);
    res.status(400).json({
      success: false,
      error: err.message || "Validation failed",
      code: err.code,
    });
  }
});

// login

const jwt = require("jsonwebtoken");

router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET || "dev_secret_123",
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/users/me", (req, res) => {
  res.json({ success: true, user: req.user });
});

router.put("/users/me", async (req, res) => {
  const { username, email } = req.body;

  try {
    // Validate
    if (!username || username.length < 3) {
      return res
        .status(400)
        .json({ error: "Username must be at least 3 characters" });
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true, runValidators: true },
    ).select("-password");

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "dev_secret_123",
      { expiresIn: "7d" },
    );

    res.json({ success: true, token, user });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Username or email already exists" });
    }
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
