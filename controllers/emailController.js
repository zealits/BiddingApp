// backend/controllers/emailController.js
const EmailVerification = require('../models/EmailVerification');
const generateOTP = require('../utils/otpGenerator');
const generateOtpEmailTemplate = require('../utils/otpEmailTemplate');

//const sendEmail = require('../utils/email');

const sendEmail = require("../utils/sendEmail"); // Assuming sendEmail function is in utils
const sendmail = require("../utils/Sendmail"); // Assuming sendEmail function is in utils
// Controller function to send an email
exports.sendEmailController = async (req, res) => {
  console.log(req.body);
  try {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Append a bid approved message to the text.
    const emailBody = `${text}\n`;

    // Call sendEmail with an options object.
    await sendmail({ to, subject, text: emailBody });
    res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email.", error: error.message });
  }
};




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
    const text = generateOtpEmailTemplate(otp);
    console.log(text);
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
