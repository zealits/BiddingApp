// backend/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Send OTP to email
router.post('/send-otp', emailController.sendOTP);

// Verify the received OTP
router.post('/verify-otp', emailController.verifyOTP);

module.exports = router;
