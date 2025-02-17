// backend/routes/adminRoutes.js
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

// Register a product with image upload (protected route)
router.post('/product', auth, upload.single('image'), adminController.registerProduct);

// View bids route...
router.get('/product/:productId/bids', auth, adminController.getProductBids);

module.exports = router;
