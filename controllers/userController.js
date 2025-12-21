const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const Profile = require("../models/Profile");

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your-secret-key-change-in-production",
    { expiresIn: process.env.JWT_EXPIRE || "30d" },
  );
};

const registerUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    const userData = { username, email, password };
    if (role && (role === "admin" || role === "user")) {
      userData.role = role;
    }

    const user = await User.create(userData);

    await Profile.create({
      user: user._id,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({
      error: "Server error during registration. Please try again.",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: "Account is inactive. Please contact support.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "Server error during login. Please try again.",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Get user with profile populated
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      profile: profile || {
        bio: "",
        favoriteGenres: [],
        profilePictureUrl: "",
        firstName: "",
        lastName: "",
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      error: "Server error. Please try again.",
    });
  }
};

const updateCurrentUser = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const userId = req.user.id;
    const updateData = req.body;

    // Update user basic info (if provided)
    if (updateData.username || updateData.email) {
      const userUpdate = {};
      if (updateData.username) userUpdate.username = updateData.username;
      if (updateData.email) userUpdate.email = updateData.email;

      // Check if username or email already exists (excluding current user)
      if (updateData.username || updateData.email) {
        const existingUser = await User.findOne({
          $or: [
            updateData.email ? { email: updateData.email } : {},
            updateData.username ? { username: updateData.username } : {},
          ],
          _id: { $ne: userId },
        });

        if (existingUser) {
          return res.status(400).json({
            error:
              existingUser.email === updateData.email
                ? "Email already in use"
                : "Username already taken",
          });
        }
      }

      await User.findByIdAndUpdate(userId, userUpdate, {
        new: true,
        runValidators: true,
      });
    }

    // Update or create profile
    const profileData = {
      bio: updateData.bio,
      favoriteGenres: updateData.favoriteGenres,
      profilePictureUrl: updateData.profilePictureUrl,
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      phoneNumber: updateData.phoneNumber,
      address: updateData.address,
    };

    // Remove undefined fields
    Object.keys(profileData).forEach((key) => {
      if (profileData[key] === undefined) {
        delete profileData[key];
      }
    });

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true, upsert: true, runValidators: true },
    );

    // Get updated user
    const user = await User.findById(userId);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      error: "Server error. Please try again.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateCurrentUser,
};
