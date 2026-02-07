const express = require('express');
const router = express.Router();
const Category = require('../models/Category'); // Import the Category model

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Public
router.post('/', async (req, res) => {
  const { name, description } = req.body;
  try {
    const newCategory = new Category({ name, description });
    const category = await newCategory.save();
    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// We can add GET by ID, PUT (update), and DELETE routes later if needed.

module.exports = router;
