// routes/cartRoutes.js
const express = require("express");
const Cart = require("../models/Cart");
const router = express.Router();

function getUserId(req) {
  if (req.body && req.body.token) {
    try {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(
        req.body.token,
        process.env.JWT_SECRET || "dev_secret_123",
      );
      return decoded.id.toString(); // ← User ID from token
    } catch (err) {
      console.warn("Invalid or expired token:", err.message);
    }
  }

  let guestId = req.session?.guestId;
  if (!guestId) {
    guestId = "guest-" + Math.random().toString(36).substr(2, 9);
    if (req.session) req.session.guestId = guestId;
  }
  return guestId;
}

router.use((req, res, next) => {
  req.userId = getUserId(req);
  next();
});

router.get("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = { items: [] };
    }

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    res.json({
      success: true,
      cart: {
        userId: req.userId,
        items: cart.items || [],
        total,
        count,
      },
    });
  } catch (err) {
    console.error(" Get cart error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { bookId, title, price, quantity = 1 } = req.body;
  if (!bookId || !title || price == null) {
    return res.status(400).json({ error: "Missing: bookId, title, price" });
  }

  try {
    let cart = await Cart.findOne({ userId: req.userId });

    if (cart) {
      const existing = cart.items.find((item) => item.bookId === bookId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ bookId, title, price, quantity });
      }
      await cart.save();
    } else {
      cart = new Cart({
        userId: req.userId,
        items: [{ bookId, title, price, quantity }],
      });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (err) {
    console.error(" Add to cart error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.put("/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const { quantity } = req.body;

  if (quantity < 0) {
    return res.status(400).json({ error: "Quantity cannot be negative" });
  }

  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    if (quantity === 0) {
      cart.items = cart.items.filter((item) => item.bookId !== bookId);
    } else {
      const item = cart.items.find((i) => i.bookId === bookId);
      if (item) {
        item.quantity = quantity;
      } else {
        return res.status(404).json({ error: "Item not in cart" });
      }
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (err) {
    console.error(" Update cart error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.delete("/:bookId", async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.bookId !== req.params.bookId);
    await cart.save();

    res.json({ success: true, cart });
  } catch (err) {
    console.error("❌ Remove from cart error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.delete("/", async (req, res) => {
  try {
    await Cart.deleteOne({ userId: req.userId });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    console.error(" Clear cart error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
