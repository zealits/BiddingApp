// routes/bidStatus.js
const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid'); // Import Bid model
const Product = require('../models/Product'); // Import Product model

// POST route to check bid status
router.post('/bid-status', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Find all bids by the email address
    const bids = await Bid.find({ email }).populate('product', 'name');

    if (!bids.length) {
      return res.status(404).json({ message: 'No bids found for this email.' });
    }

    // Format the bid details
    const bidDetails = bids.map((bid) => ({
      productName: bid.product.name,
      bidAmount: bid.amount,
      status: bid.status, // Assuming status is a field in your Bid schema
    }));

    res.json({ bids: bidDetails });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
