const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Book title is required"],
    },
    author: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Author name is required"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    genre: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.Mixed,
      default: "",
    },
    category_id: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    coverImageUrl: {
      type: String,
      default: "",
    },
    image_url: {
      type: String,
      default: "",
    },
    publishedDate: {
      type: Date,
      default: null,
    },
    isbn: {
      type: String,
      trim: true,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    numberOfPages: {
      type: Number,
      min: [1, "Number of pages must be at least 1"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

bookSchema.index({ title: "text", author: "text", description: "text" }); // Text search
bookSchema.index({ genre: 1 });
bookSchema.index({ category: 1 });
bookSchema.index({ createdAt: -1 }); // For sorting by newest

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
