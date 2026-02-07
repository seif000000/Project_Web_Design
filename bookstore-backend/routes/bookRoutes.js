const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); // Import the Book model

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const books = await Book.find().populate('category_id', 'name description'); 
    // The .populate() method replaces the category_id with the actual category name and description
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// ... existing GET route code ...

// @route   POST /api/books
// @desc    Create a new book
// @access  Public (authentication will be added later)
router.post('/', async (req, res) => {
  const { title, author, description, price, category_id, image_url } = req.body;

  try {
    const newBook = new Book({
      title,
      author,
      description,
      price,
      category_id,
      image_url
    });

    const book = await newBook.save();
    res.json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
