// backend/models/EmailVerification.js
const mongoose = require('mongoose');

const EmailVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // expires after 5 minutes
});

module.exports = mongoose.model('EmailVerification', EmailVerificationSchema);
