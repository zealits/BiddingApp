
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Admin login and other routes...
router.post('/login', adminController.loginAdmin);
router.post('/register', adminController.registerAdmin);

// Register a product with multiple image uploads (protected route)
router.post('/product', auth, upload.array('images', 10), adminController.registerProduct);

// View all bids route with pagination
// router.get('/bids', auth, adminController.getAllBids);


// View all products route with pagination
router.get('/products', auth, adminController.getProducts);

// Fetch bids for a specific product
router.get('/products/:id/bids', auth, adminController.getProductBids);


module.exports = router;
