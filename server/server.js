// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Handle invalid JSON error
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

// Simple root route for health check
app.get('/', (req, res) => {
  res.send('🌍 Expense Tracker API is running');
});

// Routes
app.use('/api/transactions', transactionRoutes);

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense-tracker';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log(`🛠 Running in ${process.env.NODE_ENV || 'development'} mode`);
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err);
});
