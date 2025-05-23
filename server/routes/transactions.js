const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// POST /api/transactions — Add a transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description } = req.body;

    // Check for missing fields
    const missingFields = [];
    if (!type) missingFields.push('type');
    if (amount === undefined || amount === null) missingFields.push('amount');
    if (!category) missingFields.push('category');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missingFields
      });
    }

    const newTransaction = new Transaction({
      type,
      amount,
      category,
      description
    });

    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Invalid transaction data' });
  }
});

// GET /api/transactions — Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ timestamp: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching transactions' });
  }
});

// GET /api/transactions/:id — Get a transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching transaction' });
  }
});

// PUT /api/transactions/:id — Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message || 'Invalid update data' });
  }
});

// DELETE /api/transactions/:id — Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting transaction' });
  }
});

module.exports = router;
