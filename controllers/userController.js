const Bid = require("../models/Bid");
const Product = require("../models/Product");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");

// Temporary storage for OTPs (in-memory, replace with Redis or database in production)
const otpStorage = {};

exports.submitBid = async (req, res) => {
  const { productId, email, phone, price, company, quantity } = req.body;

  try {
    // Ensure the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Generate a 6-digit OTP for bid verification
    const otp = generateOTP();

    // Store the OTP temporarily (keyed by email)
    otpStorage[email] = otp;

    // Send the OTP to the user's email for bid verification
    const subject = "Your Bid OTP Verification";
    const html = `<p>Your OTP for bid verification is: <strong>${otp}</strong></p>`;

    const emailOptions = {
      email: email,
      subject: subject,
      html: html,
      attachments: [],
    };

    await sendEmail(emailOptions);

    // Respond with a success message (do not send the OTP in production)
    res.json({
      msg: "OTP sent to your email. Please verify to submit your bid.",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// Verify the bid using the OTP provided by the user
exports.verifyBid = async (req, res) => {
  const { productId, email, phone, price, company, quantity, otp } = req.body;

  try {
    // Ensure the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ msg: "Product not found" });

    // Retrieve the stored OTP for the user's email
    const storedOTP = otpStorage[email];
    if (!storedOTP) {
      return res.status(400).json({ msg: "OTP expired or not found. Please request a new OTP." });
    }

    // Verify the OTP
    if (otp !== storedOTP) {
      return res.status(400).json({ msg: "Invalid OTP. Please try again." });
    }

    // Clear the OTP from storage after successful verification
    delete otpStorage[email];

    // Create and save the bid only after OTP verification
    const bid = new Bid({
      product: productId,
      email,
      phone,
      price,
      company,
      quantity,
      isVerified: true, // Mark the bid as verified
    });

    await bid.save();

    res.json({ msg: "Bid verified and submitted successfully!", bidId: bid._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};