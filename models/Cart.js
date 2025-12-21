// models/Cart.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    bookId: {
      type: String, // ObjectId.toString()
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
  },
  { _id: false },
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String, // For guests: "guest-abc123", for users: user._id.toString()
      required: true,
      index: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

cartSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
