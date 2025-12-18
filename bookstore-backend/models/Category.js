const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Matches 'NN' (Not Null) in your schema
    trim: true,
    unique: true // Category names should likely be unique
  },
  description: {
    type: String
  }
}, {
  timestamps: true // Adds 'createdAt' and 'updatedAt'
});

// Create the Model from the Schema and export it
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
