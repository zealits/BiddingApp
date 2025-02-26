// controllers/adminController.js
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Bid = require("../models/Bid");
const jwt = require("jsonwebtoken");

// Approve a bid and update product quantity
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

    // Optionally: Trigger email notification
    res.json({ msg: "Bid approved and product quantity updated", product, bid });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Register a new admin (for initial setup)
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
exports.registerProduct = async (req, res) => {
  const { name, description, specifications, quantity, deadline } = req.body;
  console.log(req.body);

  try {
    // Parse specifications if it's a JSON string
    let parsedSpecifications = [];
    if (typeof specifications === "string") {
      try {
        parsedSpecifications = JSON.parse(specifications);
        if (!Array.isArray(parsedSpecifications)) {
          parsedSpecifications = [];
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

    // Validate deadline
    const productDeadline = deadline ? new Date(deadline) : null;
    if (productDeadline && isNaN(productDeadline.getTime())) {
      return res.status(400).json({ msg: "Invalid deadline format" });
    }

    const newProduct = new Product({
      name,
      description,
      quantity: productQuantity,
      specifications: parsedSpecifications,
      deadline: productDeadline,
    });

    // If images were uploaded via Cloudinary, store the URL and public_id
    if (req.files && req.files.length > 0) {
      newProduct.images = req.files.map((file) => ({
        url: file.path,       // Cloudinary URL
        public_id: file.filename // Cloudinary public ID
      }));
    }

    await newProduct.save();
    res.json({ msg: "Product registered successfully", product: newProduct });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Update an existing product (admin-protected)
exports.updateProduct = async (req, res) => {
  const { name, description, specifications, quantity, deadline } = req.body;
  const productId = req.params.id;

  try {
    // Parse specifications if provided as JSON string
    let parsedSpecifications = [];
    if (typeof specifications === "string") {
      try {
        parsedSpecifications = JSON.parse(specifications);
        if (!Array.isArray(parsedSpecifications)) {
          parsedSpecifications = [];
        }
      } catch (error) {
        console.error("Invalid JSON format for specifications:", error);
        return res.status(400).json({ msg: "Invalid specifications format" });
      }
    } else {
      parsedSpecifications = Array.isArray(specifications) ? specifications : [];
    }

    // Convert quantity to a number (default to 1)
    const productQuantity = Number(quantity) || 1;

    // Validate deadline
    const productDeadline = deadline ? new Date(deadline) : null;
    if (productDeadline && isNaN(productDeadline.getTime())) {
      return res.status(400).json({ msg: "Invalid deadline format" });
    }

    // Build update fields
    const updateFields = {
      name,
      description,
      quantity: productQuantity,
      specifications: parsedSpecifications,
      deadline: productDeadline,
    };

    // If new images were uploaded, update the images array with Cloudinary data
    if (req.files && req.files.length > 0) {
      updateFields.images = req.files.map((file) => ({
        url: file.path,       // Cloudinary URL
        public_id: file.filename // Cloudinary public ID
      }));
    }

    // Find and update the product
    let product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    product = await Product.findByIdAndUpdate(
      productId,
      { $set: updateFields },
      { new: true }
    );

    res.json({ msg: "Product updated successfully", product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Delete a product (admin-protected)
exports.deleteProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Optionally: Remove images from Cloudinary using product.images.public_id
    // (Call Cloudinary's destroy method here if needed)

    await Product.findByIdAndDelete(productId);
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get paginated products (admin-protected)
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    const query = searchQuery
      ? { name: { $regex: searchQuery, $options: "i" } }
      : {};

    const products = await Product.find(query, "name description images quantity specifications deadline")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(query);
    res.json({ products, totalPages: Math.ceil(totalProducts / limit) });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get bids for a specific product (admin-protected)
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

// Get a single product by ID (admin-protected)
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
