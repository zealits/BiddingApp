// backend/server.js
const path = require('path');

const express = require('express');
const connectDB = require('./config/db');
// require('dotenv').config();
require('dotenv').config({ path: "./config/config.env" });
const cors = require('cors');
const app = express();

// Connect to the database
connectDB();
app.use(cors());
// Middleware to parse JSON
app.use(express.json({ extended: false }));

// Mount routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));

// Test route
// app.get('/', (req, res) => res.send('Bidding App API Running'));
app.use(express.static(path.join(__dirname, "./frontend/dist")));

// Catch-all route to serve React's index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/dist/index.html"));
});
const PORT = process.env.PORT || 1710;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
