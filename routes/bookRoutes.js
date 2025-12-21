// routes/bookRoutes.js
const express = require("express");
const Book = require("../models/Book");
const { protect } = require("../middleware/auth"); // Reuse your existing auth

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await Book.find().skip(skip).limit(limit);
    const total = await Book.countDocuments();

    res.json({
      success: true,
      books,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, book });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin access required" });
  }

  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json({ success: true, book });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: err.message || "Validation failed" });
  }
});

router.put("/:id", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin access required" });
  }

  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, book });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, error: err.message || "Validation failed" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, error: "Admin access required" });
  }

  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, error: "Book not found" });
    }
    res.json({ success: true, message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
