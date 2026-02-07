const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const OrderItem = require('../models/OrderItem');
const Book = require('../models/Book'); // Needed to verify price/existence
const User = require('../models/User'); // Needed to verify user existence

// @route   POST /api/orders
// @desc    Create a new order and associated order items
// @access  Public (authentication layer would usually go here)
router.post('/', async (req, res) => {
  const { user_id, shipping_address, items } = req.body; // 'items' is an array of {book_id, quantity}

  try {
    // Basic validation that the user exists (optional but good practice)
    const userExists = await User.findById(user_id);
    if (!userExists) {
        return res.status(404).json({ msg: 'User not found' });
    }

    let total_price = 0;
    const orderItems = [];

    // Calculate total price and prepare order items
    for (const item of items) {
      const book = await Book.findById(item.book_id);
      if (!book) {
        return res.status(404).json({ msg: `Book not found for ID: ${item.book_id}` });
      }
      const itemPrice = book.price * item.quantity;
      total_price += itemPrice;

      orderItems.push({
        book_id: item.book_id,
        quantity: item.quantity,
        price: book.price // Store the price at time of purchase
      });
    }

    // Create the main Order document
    const newOrder = new Order({
      user_id,
      shipping_address,
      total_price,
      payment_status: 'pending'
    });

    const order = await newOrder.save();

    // Link the order items to the newly created order ID
    const savedOrderItems = await Promise.all(orderItems.map(item => {
        item.order_id = order._id;
        return new OrderItem(item).save();
    }));

    res.status(201).json({ order, orderItems: savedOrderItems });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin view)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user_id', 'username email')
            .sort({ createdAt: -1 }); // Show newest orders first
        res.json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
