const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  data: { type: String, required: true },         // Base64 encoded image data
  contentType: { type: String, required: true }   // e.g., "image/jpeg"
});

const SpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  images: [ImageSchema],  // Array of images
  specifications: [SpecificationSchema], // Array of specifications
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', ProductSchema);
