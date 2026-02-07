const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON data (for handling POST requests)
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Successfully connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Define Routes and Models ---

// Basic Root Route
app.get('/', (req, res) => {
  res.send('Bookstore Backend is running!');
});

// Import necessary models for the seed-data route (optional once actual API routes are made)
const Book = require('./models/Book');
const Category = require('./models/Category');

// A route to seed initial data (add a category and a book)
app.get('/api/seed-data', async (req, res) => {
  try {
    // 1. Create a default Category if it doesn't exist
    let techCategory = await Category.findOne({ name: 'Technology' });
    if (!techCategory) {
      techCategory = await Category.create({ name: 'Technology', description: 'Books about programming and IT' });
    }

    // 2. Create a sample Book associated with that category
    const sampleBook = await Book.create({
      title: 'The MERN Stack Handbook',
      author: 'AI Assistant',
      description: 'A guide to building apps with MongoDB, Express, React, and Node.',
      price: 29.99,
      category_id: techCategory._id,
      image_url: 'http://example.com/mern-book-cover.jpg'
    });

    res.status(200).json({ message: 'Seed data created successfully', category: techCategory, book: sampleBook });

  } catch (error) {
    res.status(500).json({ message: 'Error seeding data', error: error.message });
  }
});

// Define Routes
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));


// --- Start the server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
