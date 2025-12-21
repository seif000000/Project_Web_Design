const { validationResult } = require("express-validator");
const Book = require("../models/Book");

const createBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const bookData = req.body;

    // Create book
    const book = await Book.create(bookData);

    res.status(201).json({
      message: "Book created successfully",
      book,
    });
  } catch (error) {
    console.error("Create book error:", error);
    res.status(500).json({
      error: "Server error. Could not create book.",
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const {
      genre,
      category,
      search,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query
    const query = {};

    if (genre) {
      query.genre = genre;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    let books = await Book.find(query).sort(sort).skip(skip).limit(limitNum);

    // Get total count for pagination
    let total = await Book.countDocuments(query);

    // If Mongoose collection is empty, try to sync from native collection
    if (total === 0 && !genre && !category && !search) {
      console.log(
        "  Mongoose collection is empty. Attempting to sync from native collection...",
      );

      try {
        const mongoose = require("mongoose");
        const { MongoClient } = require("mongodb");
        const mongoUrl =
          process.env.MONGODB_URI ||
          process.env.MONGODB_URL ||
          "mongodb://localhost:27017";
        const dbName = process.env.DB_NAME || "bookworms_db";

        const client = await MongoClient.connect(mongoUrl);
        const db = client.db(dbName);
        const nativeBooks = await db.collection("books").find({}).toArray();
        await client.close();

        if (nativeBooks.length > 0) {
          console.log(
            ` Found ${nativeBooks.length} books in native collection. Syncing to Mongoose...`,
          );
          // Transform and insert into Mongoose collection
          for (const nativeBook of nativeBooks) {
            const bookData = {
              title:
                nativeBook.title ||
                (typeof nativeBook.title === "object"
                  ? nativeBook.title
                  : { en: nativeBook.title || "", ar: nativeBook.title || "" }),
              author:
                nativeBook.author ||
                (typeof nativeBook.author === "object"
                  ? nativeBook.author
                  : {
                      en: nativeBook.author || "",
                      ar: nativeBook.author || "",
                    }),
              category:
                nativeBook.category ||
                (typeof nativeBook.category === "object"
                  ? nativeBook.category
                  : {
                      en: nativeBook.category || "",
                      ar: nativeBook.category || "",
                    }),
              genre:
                typeof nativeBook.category === "object"
                  ? nativeBook.category.en
                  : nativeBook.category || nativeBook.genre || "",
              price: nativeBook.price || 0,
              image_url: nativeBook.image_url || "",
              coverImageUrl:
                nativeBook.coverImageUrl || nativeBook.image_url || "",
              description: nativeBook.description || "",
              isNewArrival: nativeBook.isNewArrival || false,
              stock: nativeBook.stock || 0,
              isAvailable: nativeBook.isAvailable !== false,
              rating: nativeBook.rating || 0,
              numberOfPages: nativeBook.numberOfPages || null,
            };

            // Check if book already exists
            const titleToCheck =
              typeof bookData.title === "object"
                ? bookData.title.en
                : bookData.title;
            const existing = await Book.findOne({
              $or: [{ "title.en": titleToCheck }, { title: titleToCheck }],
            });

            if (!existing) {
              await Book.create(bookData);
            }
          }

          // Re-query after sync
          books = await Book.find(query).sort(sort).skip(skip).limit(limitNum);
          total = await Book.countDocuments(query);
          console.log(
            ` Synced ${nativeBooks.length} books to Mongoose collection.`,
          );
        } else {
          console.log(
            '  Both collections are empty. Run "npm run seed" to populate books.',
          );
        }
      } catch (syncError) {
        console.error(
          " Error syncing from native collection:",
          syncError.message,
        );
        console.log('  Run "npm run seed" to populate books.');
      }
    }

    // Format books for frontend compatibility
    const formattedBooks = books.map((book) => {
      const bookObj = book.toObject();
      // Ensure cover field exists (frontend expects 'cover')
      if (bookObj.image_url && !bookObj.cover) {
        bookObj.cover = bookObj.image_url;
      }
      if (bookObj.coverImageUrl && !bookObj.cover) {
        bookObj.cover = bookObj.coverImageUrl;
      }
      // Ensure id field exists
      if (!bookObj.id) {
        bookObj.id = bookObj._id.toString();
      }
      return bookObj;
    });

    res.json({
      books: formattedBooks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBooks: total,
        hasNext: skip + books.length < total,
        hasPrev: pageNum > 1,
      },
    });
  } catch (error) {
    console.error("Get all books error:", error);
    res.status(500).json({
      error: "Server error. Could not fetch books.",
    });
  }
};
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    // Format book for frontend compatibility
    const bookObj = book.toObject();
    if (bookObj.image_url && !bookObj.cover) {
      bookObj.cover = bookObj.image_url;
    }
    if (bookObj.coverImageUrl && !bookObj.cover) {
      bookObj.cover = bookObj.coverImageUrl;
    }
    if (!bookObj.id) {
      bookObj.id = bookObj._id.toString();
    }

    res.json({ book: bookObj });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid book ID format",
      });
    }
    console.error("Get book by ID error:", error);
    res.status(500).json({
      error: "Server error. Could not fetch book.",
    });
  }
};

const updateBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Remove undefined fields
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    const book = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.json({
      message: "Book updated successfully",
      book,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid book ID format",
      });
    }
    console.error("Update book error:", error);
    res.status(500).json({
      error: "Server error. Could not update book.",
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        error: "Book not found",
      });
    }

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        error: "Invalid book ID format",
      });
    }
    console.error("Delete book error:", error);
    res.status(500).json({
      error: "Server error. Could not delete book.",
    });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
};
