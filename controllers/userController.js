// backend/controllers/userController.js
const Bid = require("../models/Bid");
const Product = require("../models/Product");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");

// Submit a bid for a product and send an OTP for bid verification
exports.submitBid = async (req, res) => {
  // Extract company and quantity along with other fields
  const { productId, email, phone, price, company, quantity } = req.body;
  console.log(req.body);
  try {
    // Ensure the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Generate a 6-digit OTP for bid verification
    const otp = generateOTP();

    // Create a new bid (initially not verified)
    let bid = new Bid({
      product: productId,
      email,
      phone,
      price,
      company,
      quantity,
      otp,
      isVerified: false,
    });
    await bid.save();

    // Send the OTP to the user's email for bid verification
    const subject = "Your Bid OTP Verification";
    const html = `<p>Your OTP for bid verification is: <strong>${otp}</strong></p>`;

    // Define email options
    const emailOptions = {
      email: email,
      subject: subject,
      html: html,
      attachments: [],
    };

    // Send email using sendEmail function
    await sendEmail(emailOptions);

    res.json({ msg: "Bid submitted. Please verify OTP sent to your email.", bidId: bid._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Verify the bid using the OTP provided by the user
exports.verifyBid = async (req, res) => {
  const { bidId, otp } = req.body;
  try {
    let bid = await Bid.findById(bidId);
    if (!bid) return res.status(404).json({ msg: "Bid not found" });
    if (bid.isVerified) return res.status(400).json({ msg: "Bid already verified" });
    if (bid.otp !== otp) return res.status(400).json({ msg: "Invalid OTP" });

    // Mark the bid as verified and clear the OTP
    bid.isVerified = true;
    bid.otp = undefined;
    await bid.save();

    res.json({ msg: "Bid verified successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
