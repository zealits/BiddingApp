const nodemailer = require("nodemailer");

const sendmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Only for development
    },
  });

  // Use options.to if provided; otherwise, fall back to options.email
  const recipient = options.to || options.email;
  if (!recipient) {
    throw new Error("No recipient provided in options.");
  }

  // Create email content; use options.html if provided, otherwise format options.text
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: recipient,
    subject: options.subject,
    html: options.html || `<pre>${options.text}</pre>`,
    attachments: options.attachments, // For QR code attachment if any
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendmail;
