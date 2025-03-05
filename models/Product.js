const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
  url: { type: String, required: true }, // Cloudinary URL
  public_id: { type: String, required: true } // Public ID for managing images in Cloudinary
});

const SpecificationSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, default: 1 },
  images: [ImageSchema],               // Array of images
  specifications: [SpecificationSchema], // Array of specifications
  createdAt: { type: Date, default: Date.now },
  deadline: { type: Date, required: true }  // Added deadline element
});

module.exports = mongoose.model('Product', ProductSchema);
