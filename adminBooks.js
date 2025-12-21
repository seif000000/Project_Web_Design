// adminBooks.js — FINAL WORKING VERSION
const express = require("express");
const { ObjectId } = require("mongodb");

module.exports = (db) => {
  const router = express.Router();

  const requireAdmin = (req, res, next) => {
    // Option 1: Check session/user (if you store admin in session)
    // if (req.session?.user?.role === 'admin') return next();

    // Option 2: Check JWT token (recommended — reuse your auth system)
    const token = req.headers.authorization?.split(" ")[1] || req.body.token;
    if (!token) {
      return res.status(401).json({ error: "Admin access required" });
    }

    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "dev_secret_123",
      );
      if (decoded.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }
      req.admin = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  };

  // Only protect write routes — allow public read if desired
  // For full security, protect all:
  // router.use(requireAdmin); // ← Uncomment to protect ALL /admin routes

  // Or protect only write routes:
  const writeRoutes = ["/books", "/books/:id"];
  router.use((req, res, next) => {
    if (
      req.method !== "GET" &&
      writeRoutes.some((path) => req.path.startsWith(path.replace(":id", "")))
    ) {
      requireAdmin(req, res, next);
    } else {
      next();
    }
  });

  router.get("/books", async (req, res) => {
    if (!db) {
      return res.status(503).json({ error: "Database not connected" });
    }
    try {
      const books = await db.collection("books").find({}).toArray();
      res.json(books);
    } catch (err) {
      console.error("❌ GET /admin/books error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  router.get("/books/:id", async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database not connected" });
    try {
      const book = await db
        .collection("books")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (!book) return res.status(404).json({ error: "Book not found" });
      res.json(book);
    } catch (err) {
      res.status(500).json({ error: "Invalid ID or server error" });
    }
  });

  router.post("/books", async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database not connected" });
    try {
      const {
        title,
        author,
        category,
        description = "",
        price = 0,
        image_url = "",
        stock = 0,
        rating = 0,
        genre = "",
        isbn = "",
        numberOfPages = null,
        isAvailable = true,
      } = req.body;

      if (!title || !author || price < 0) {
        return res
          .status(400)
          .json({ error: "Title, author, and price required" });
      }

      const newBook = {
        title: typeof title === "string" ? { ar: title, en: title } : title,
        author:
          typeof author === "string" ? { ar: author, en: author } : author,
        category:
          typeof category === "string"
            ? { ar: category, en: category }
            : category,
        description,
        price: parseFloat(price),
        image_url,
        cover: image_url,
        stock: parseInt(stock),
        rating: parseFloat(rating),
        genre,
        isbn,
        numberOfPages: numberOfPages ? parseInt(numberOfPages) : null,
        isAvailable,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection("books").insertOne(newBook);
      res.status(201).json({ message: "Book added", id: result.insertedId });
    } catch (err) {
      console.error("❌ POST /admin/books error:", err);
      res
        .status(500)
        .json({ error: "Failed to add book", detail: err.message });
    }
  });

  router.put("/books/:id", async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database not connected" });
    try {
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };

      // Convert strings to bilingual if needed
      if (typeof updateData.title === "string") {
        updateData.title = { ar: updateData.title, en: updateData.title };
      }
      if (typeof updateData.author === "string") {
        updateData.author = { ar: updateData.author, en: updateData.author };
      }
      if (typeof updateData.category === "string") {
        updateData.category = {
          ar: updateData.category,
          en: updateData.category,
        };
      }

      const result = await db
        .collection("books")
        .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json({ message: "Book updated" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to update book", detail: err.message });
    }
  });

  router.delete("/books/:id", async (req, res) => {
    if (!db) return res.status(503).json({ error: "Database not connected" });
    try {
      const result = await db
        .collection("books")
        .deleteOne({ _id: new ObjectId(req.params.id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
      res.json({ message: "Book deleted" });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to delete book", detail: err.message });
    }
  });

  return router;
};
