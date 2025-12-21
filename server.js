const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { protect } = require("./middleware/auth");

// Existing admin routes (using native MongoDB driver)
const adminBooks = require("./adminBooks");

// New backend routes (using Mongoose)
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const bookRoutes = require("./routes/bookRoutes");
const diagnosticRoutes = require("./routes/diagnosticRoutes");

const app = express();
const path = require("path");

// Middleware
app.use(cors());
// Increase body parser limit to handle large image uploads (base64 encoded images)
app.use(bodyParser.json({ limit: "50mb" })); // Increased from default 100kb to 10mb
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" })); // Increased from default 100kb to 10mb

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "bookworms_secret_123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  }),
);
// Mount user routes — protect /users/me
app.use("/api/auth", userRoutes); // register/login are public
app.use("/api/users", protect, userRoutes); // me, update are protected
app.use("/api/books", bookRoutes); // ← Critical: /api/books
// Serve static files from the root directory (frontend)
app.use(express.static(path.join(__dirname)));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/users/me", protect, userRoutes); // or attach inside userRoutes

// MongoDB connection for existing admin routes (native driver)
const mongoUrl =
  process.env.MONGODB_URI ||
  process.env.MONGODB_URL ||
  "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "bookworms_db";

let db;

// Connect to MongoDB using native driver (for existing admin routes)
MongoClient.connect(mongoUrl)
  .then((client) => {
    console.log(" MongoDB (Native Driver) connected!");
    db = client.db(dbName);

    // Initialize existing admin routes
    app.use("/admin", adminBooks(db));
  })
  .catch((err) => {
    console.error(" MongoDB (Native Driver) connection error:", err.message);
    console.log(
      "  Existing admin routes may not work until MongoDB is connected",
    );
    app.use("/admin", adminBooks(null));
  });

// Connect to MongoDB using Mongoose (for new backend)
connectDB()
  .then(() => {
    console.log(" MongoDB (Mongoose) connected!");
  })
  .catch((err) => {
    console.error(" MongoDB (Mongoose) connection error:", err.message);
  });

// New API routes
app.use("/api", userRoutes);
app.use("/api", bookRoutes);
app.use("/api/diagnostic", diagnosticRoutes);

app.use("/api/cart", require("./routes/cartRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// For all other routes, serve index.html (SPA fallback)
app.get("*", (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith("/api") && !req.path.startsWith("/admin")) {
    res.sendFile(path.join(__dirname, "index.html"));
  } else {
    res.status(404).json({
      error: "Route not found",
      path: req.path,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(" Server running on http://localhost:" + PORT);
  console.log(
    " Existing admin endpoints: http://localhost:" + PORT + "/admin/books",
  );
  console.log("API endpoints:");
  console.log("   - POST   /api/auth/register");
  console.log("   - POST   /api/auth/login");
  console.log("   - GET    /api/users/me (Protected)");
  console.log("   - PUT    /api/users/me (Protected)");
  console.log("   - GET    /api/books");
  console.log("   - GET    /api/books/:id");
  console.log("   - POST   /api/books (Admin Only)");
  console.log("   - PUT    /api/books/:id (Admin Only)");
  console.log("   - DELETE /api/books/:id (Admin Only)");
});
