// backend/controllers/adminController.js
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const jwt = require("jsonwebtoken");

// Optional: Register a new admin (for initial setup)
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (admin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }
    admin = new Admin({ email, password });
    await admin.save();
    res.json({ msg: "Admin registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Admin login: returns a JWT if credentials are valid
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }
    const payload = { admin: { id: admin.id, email: admin.email } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Register a new product for bidding (admin-protected)
// backend/controllers/adminController.js

exports.registerProduct = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newProduct = new Product({
      name,
      description,
    });
    // If images were uploaded, process each file and store in the images array
    if (req.files && req.files.length > 0) {
      newProduct.images = req.files.map(file => ({
        data: file.buffer.toString('base64'),
        contentType: file.mimetype,
      }));
    }
    await newProduct.save();
    // res.json(newProduct);
    res.json({ msg: "Product registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// View all bids for a given product (admin-protected)
// Backend: Fetch paginated products
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    
    const products = await Product.find({}, 'name description images')
      .skip(skip)
      .limit(limit);
    
    const totalProducts = await Product.countDocuments();
    res.json({ products, totalPages: Math.ceil(totalProducts / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Backend: Fetch bids for a specific product
exports.getProductBids = async (req, res) => {
  try {
    const productId = req.params.id;
    const bids = await Bid.find({ product: productId }, 'email phone price isVerified');
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};