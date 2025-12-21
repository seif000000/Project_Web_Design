const express = require("express");
const mongoose = require("mongoose");
const Book = require("../models/Book");
const User = require("../models/User");
const { MongoClient } = require("mongodb");

const router = express.Router();

router.get("/status", async (req, res) => {
  try {
    const status = {
      mongoose: {
        connected: mongoose.connection.readyState === 1,
        state: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
        database: mongoose.connection.name,
        host: mongoose.connection.host,
      },
      collections: {
        books: {
          mongoose: 0,
          native: 0,
        },
        users: {
          mongoose: 0,
        },
      },
      message: "",
    };

    try {
      status.collections.books.mongoose = await Book.countDocuments();
    } catch (err) {
      status.collections.books.mongoose = "Error: " + err.message;
    }

    try {
      status.collections.users.mongoose = await User.countDocuments();
    } catch (err) {
      status.collections.users.mongoose = "Error: " + err.message;
    }

    try {
      const mongoUrl =
        process.env.MONGODB_URI ||
        process.env.MONGODB_URL ||
        "mongodb://localhost:27017";
      const dbName = process.env.DB_NAME || "bookworms_db";
      const client = await MongoClient.connect(mongoUrl);
      const db = client.db(dbName);
      const booksCollection = db.collection("books");
      status.collections.books.native = await booksCollection.countDocuments();
      await client.close();
    } catch (err) {
      status.collections.books.native = "Error: " + err.message;
    }

    // Generate message
    if (
      status.collections.books.mongoose === 0 &&
      status.collections.books.native === 0
    ) {
      status.message =
        ' Database is empty! Run "npm run seed" to populate books.';
    } else if (status.collections.books.mongoose === 0) {
      status.message =
        ' Mongoose collection is empty but native collection has data. Run "npm run seed:books" to sync.';
    } else {
      status.message = " Database is populated and ready!";
    }

    res.json(status);
  } catch (error) {
    res.status(500).json({
      error: "Diagnostic check failed",
      message: error.message,
    });
  }
});

module.exports = router;
