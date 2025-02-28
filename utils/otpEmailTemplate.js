// utils/otpEmailTemplate.js
const generateOtpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification OTP</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(to right, #6d48e5, #9d7aea);
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
      margin: -20px -20px 20px -20px;
    }
    .header h1 {
      color: white;
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 10px 20px;
      text-align: center;
    }
    .otp-box {
      background-color: #f8f9fa;
      border-radius: 6px;
      padding: 20px;
      margin: 25px 0;
      font-size: 32px;
      letter-spacing: 5px;
      font-weight: bold;
      color: #333;
      border: 1px dashed #ccc;
    }
    .message {
      line-height: 1.6;
      color: #444;
      margin-bottom: 25px;
    }
    .note {
      font-size: 13px;
      color: #777;
      font-style: italic;
      margin-top: 30px;
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
      margin-top: 20px;
      color: #777;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Email Verification</h1>
    </div>
    
    <div class="content">
      <p class="message">We need to verify your email address. Please use the following One-Time Password (OTP) to complete your verification:</p>
      <div class="otp-box">${otp}</div>
      <p class="message">This OTP is valid for 5 minutes. If you didn't request this code, please ignore this email.</p>
      <p class="note">For security reasons, please do not share this OTP with anyone.</p>
    </div>
    
    <div class="footer">
  <p>© 2025 <a href="https://aiiventure.com">Aii Venture</a>. All rights reserved.</p>
</div>

  </div>
</body>
</html>
`;

module.exports = generateOtpEmailTemplate;
