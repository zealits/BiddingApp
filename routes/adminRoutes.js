// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// Import the Cloudinary upload middleware from services/cloudinaryService.js
const upload = require('../services/cloudinaryService');

// Admin authentication routes
router.post('/login', adminController.loginAdmin);
router.post('/register', adminController.registerAdmin);

// Product routes (protected by auth)
// Use Cloudinary middleware to handle image uploads (up to 10 images)
router.post('/product', auth, upload.array('images', 10), adminController.registerProduct);
router.put('/product/:id', auth, upload.array('images', 10), adminController.updateProduct);
router.delete('/product/:id', auth, adminController.deleteProduct);

// Bid and product retrieval routes
router.post('/approve-bid', auth, adminController.approveBid);
router.get('/products', auth, adminController.getProducts);
router.get('/products/:id/bids', auth, adminController.getProductBids);
router.get('/products/:id', auth, adminController.getProductById);

module.exports = router;
