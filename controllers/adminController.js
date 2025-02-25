// backend/controllers/adminController.js
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const jwt = require("jsonwebtoken");

// backend/controllers/adminController.js

exports.approveBid = async (req, res) => {
  const { bidId, productId } = req.body;

  try {
    // Find the bid and product
    const bid = await Bid.findById(bidId);
    const product = await Product.findById(productId);

    if (!bid || !product) {
      return res.status(404).json({ msg: "Bid or Product not found" });
    }

    // Check if the product quantity is sufficient
    if (product.quantity < bid.quantity) {
      return res.status(400).json({ msg: "Insufficient product quantity" });
    }

    // Reduce the product quantity
    product.quantity -= bid.quantity;
    await product.save();

    // Update the bid status to "Approved"
    bid.status = "Approved";
    await bid.save();

    // Send the email (you can use your existing email sending logic here)
    // ...

    res.json({ msg: "Bid approved and product quantity updated", product, bid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
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
  const { name, description, specifications, quantity, deadline } = req.body; // Include deadline in destructuring
  console.log(req.body);

  try {
    // Parse specifications if it's a JSON string
    let parsedSpecifications = [];
    if (typeof specifications === "string") {
      try {
        parsedSpecifications = JSON.parse(specifications);
        if (!Array.isArray(parsedSpecifications)) {
          parsedSpecifications = []; // Ensure it's an array
        }
      } catch (error) {
        console.error("Invalid JSON format for specifications:", error);
        return res.status(400).json({ msg: "Invalid specifications format" });
      }
    } else {
      parsedSpecifications = Array.isArray(specifications) ? specifications : [];
    }

    // Convert quantity to a number (default to 1 if not provided)
    const productQuantity = Number(quantity) || 1;

    // Validate deadline (ensure it's a valid date)
    const productDeadline = deadline ? new Date(deadline) : null;
    if (productDeadline && isNaN(productDeadline.getTime())) {
      return res.status(400).json({ msg: "Invalid deadline format" });
    }

    const newProduct = new Product({
      name,
      description,
      quantity: productQuantity, // Add the quantity field
      specifications: parsedSpecifications,
      deadline: productDeadline, // Add the deadline field
    });

    // If images were uploaded, process each file and store in the images array
    if (req.files && req.files.length > 0) {
      newProduct.images = req.files.map((file) => ({
        data: file.buffer.toString("base64"),
        contentType: file.mimetype,
      }));
    }

    await newProduct.save();
    res.json({ msg: "Product registered successfully", product: newProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// View all bids for a given product (admin-protected)
// Backend: Fetch paginated products
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const products = await Product.find({}, "name description quantity images deadline").sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments();
    res.json({ products, totalPages: Math.ceil(totalProducts / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Backend: Fetch bids for a specific product
// backend/controllers/adminController.js
exports.getProductBids = async (req, res) => {
  try {
    const productId = req.params.id;
    const bids = await Bid.find({ product: productId }).sort({ createdAt: -1 });
    res.json(bids);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Fetch a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
