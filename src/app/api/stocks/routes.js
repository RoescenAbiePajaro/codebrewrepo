// routes/stocks.js
import express from 'express';
import { MenuItem } from './models/MenuItem';

const router = express.Router();

// Get all stock items
router.get('/api/stocks', async (req, res) => {
  try {
    const stocks = await MenuItem.find({}, 'name basePrice stock');
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stock
router.put('/api/stocks/:id', async (req, res) => {
  const { id } = req.params;
  const { stock } = req.body;
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(id, { stock }, { new: true });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
