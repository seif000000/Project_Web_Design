const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model
const Role = require('../models/Role'); // Import the Role model

// IMPORTANT: Add JWT Secret Key to your .env file
// JWT_SECRET=your_super_secret_key_here

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Find the default 'user' role
    const defaultRole = await Role.findOne({ name: 'user' });
    if (!defaultRole) {
        return res.status(500).json({ msg: 'Default role not found. Please seed roles first.' });
    }

    user = new User({
      username,
      email,
      password, // Password is raw here
      role_id: defaultRole._id
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // In a real app, you would generate a JWT token here and send it back.
    res.status(201).json({ msg: 'User registered successfully (password hashed)' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin view)
// @access  Public (should be private/admin only in a real app)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('role_id', 'name'); // Don't return passwords
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
