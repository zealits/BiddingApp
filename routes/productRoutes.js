const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Retrieve paginated products
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const products = await Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Product.countDocuments();

    res.json({ products, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
