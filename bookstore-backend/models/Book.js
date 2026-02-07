const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Matches 'NN' (Not Null) in your schema
    trim: true
  },
  author: {
    type: String,
    required: true, // Matches 'NN'
    trim: true
  },
  description: {
    type: String
    // Text type in schema maps well to a standard String in Mongoose
  },
  price: {
    type: Number, // Use Number for price in JS, Mongoose handles precision well
    required: true // Matches 'NN'
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId, // This creates the link/reference to the Categories collection
    ref: 'Category', // The name of the model we will link to later
    required: true
  },
  image_url: {
    type: String
  }
}, {
  timestamps: true // Mongoose adds 'createdAt' and 'updatedAt' fields automatically
});

// Create the Model from the Schema and export it
const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
