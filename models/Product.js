const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  data: { type: String, required: true },         // Base64 encoded image data
  contentType: { type: String, required: true }     // e.g., "image/jpeg"
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [ImageSchema],  // Array of images
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
