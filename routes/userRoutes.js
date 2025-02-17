// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Submit a bid (public route)
router.post('/bid', userController.submitBid);

// Verify bid OTP (public route)
router.post('/bid/verify', userController.verifyBid);

module.exports = router;
