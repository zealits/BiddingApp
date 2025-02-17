// backend/controllers/emailController.js
const EmailVerification = require('../models/EmailVerification');
const generateOTP = require('../utils/otpGenerator');
const sendEmail = require('../utils/email');

exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ msg: 'Email is required' });
  try {
    const otp = generateOTP();
    // Update existing verification or create a new one
    let verification = await EmailVerification.findOne({ email });
    if (verification) {
      verification.otp = otp;
      verification.createdAt = Date.now();
    } else {
      verification = new EmailVerification({ email, otp });
    }
    await verification.save();
    
    // Send the OTP to the provided email
    const subject = 'Your Email Verification OTP';
    const text = `Your OTP for email verification is: ${otp}`;
    await sendEmail(email, subject, text);
    
    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ msg: 'Email and OTP are required' });
  try {
    const verification = await EmailVerification.findOne({ email });
    if (!verification) {
      return res.status(400).json({ msg: 'OTP not found. Please request a new one.' });
    }
    if (verification.otp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }
    // OTP verified successfully – remove the verification record
    await EmailVerification.deleteOne({ email });
    res.json({ msg: 'Email verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
