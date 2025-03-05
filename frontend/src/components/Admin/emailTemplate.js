export const generateEmailBody = (bid, modalProductName) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bid Approval</title>
  <style>
    /* Responsive adjustments */
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        padding: 10px !important;
      }
      .header h1 {
        font-size: 22px !important;
      }
      .content {
        padding: 15px !important;
      }
      .button {
        padding: 10px 20px !important;
      }
    }
    body {
      font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f7f7f7;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .header {
      background: linear-gradient(135deg, #4a90e2, #50a8e0);
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      color: #fff;
      margin: 0;
      font-size: 26px;
      letter-spacing: 1px;
    }
    .content {
      padding: 20px 30px;
    }
    .success-icon {
      font-size: 56px;
      text-align: center;
      margin-bottom: 20px;
    }
    .message {
      font-size: 16px;
      color: #444;
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .details-box {
      background-color: #f1faff;
      border-radius: 8px;
      padding: 15px;
      margin: 20px 0;
      border-left: 5px solid #4a90e2;
    }
    .details-box h2 {
      font-size: 20px;
      margin-bottom: 15px;
      color: #333;
      border-bottom: 1px solid #e0e0e0;
      padding-bottom: 5px;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .label {
      font-weight: 600;
      color: #555;
    }
    .value {
      color: #333;
    }
    .button {
      display: inline-block;
      background-color: #4a90e2;
      color: #ffffff;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 5px;
      font-weight: bold;
      margin-top: 20px;
      transition: background-color 0.3s ease;
    }
    .button:hover {
      background-color: #357ab7;
    }
    .footer {
      background-color: #f7f7f7;
      text-align: center;
      padding: 15px 20px;
      font-size: 14px;
      color: #777;
      border-top: 1px solid #e0e0e0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Bid Approved</h1>
    </div>
    <div class="content">
      <div class="success-icon">✅</div>
      <p class="message">Congratulations! Your bid for <strong>${modalProductName}</strong> has been approved. We appreciate your trust in our service.</p>
      <div class="details-box">
        <h2>Bid Details</h2>
        <div class="detail-row">
          <span class="label">Email:</span>
          <span class="value">${bid.email}</span>
        </div>
        <div class="detail-row">
          <span class="label">Phone:</span>
          <span class="value">${bid.phone}</span>
        </div>
        <div class="detail-row">
          <span class="label">Price:</span>
          <span class="value">$${bid.price}</span>
        </div>
        <div class="detail-row">
          <span class="label">Quantity:</span>
          <span class="value">${bid.quantity}</span>
        </div>
      </div>
      <p class="message">Thank you for your business. If you have any questions or need further assistance, please feel free to contact our support team.</p>
      <div style="text-align: center;">
        <a href="#" class="button">View Order Details</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2025 Your Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
