// backend/models/Bid.js
const mongoose = require('mongoose');

const BidSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  isVerified: { type: Boolean, default: false },
  otp: { type: String }, // For bid verification (if needed)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bid', BidSchema);
