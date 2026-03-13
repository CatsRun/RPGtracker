// routes/items.js
const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET all items
router.get('/', async (req, res, next) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) { next(err); }
});

// GET a single item by ID
router.get('/:id', async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'NotFound', message: 'Item not found' });
    res.json(item);
  } catch (err) { next(err); }
});

// POST create item (basic validation)
router.post('/', async (req, res, next) => {
  try {
    const { itemName, category, sellPrice, growthTime } = req.body;

    if (!itemName) return res.status(400).json({ error: 'ValidationError', message: 'itemName is required' });
    if (!category) return res.status(400).json({ error: 'ValidationError', message: 'category is required' });
    if (sellPrice === undefined || sellPrice === null) return res.status(400).json({ error: 'ValidationError', message: 'sellPrice is required' });
    if (typeof sellPrice === 'number' && sellPrice < 0) return res.status(400).json({ error: 'ValidationError', message: 'sellPrice cannot be negative' });
    if (growthTime !== undefined && typeof growthTime === 'number' && growthTime < 0) return res.status(400).json({ error: 'ValidationError', message: 'growthTime cannot be negative' });

    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) { next(err); }
});

// PUT update item by ID (basic validation)
router.put('/:id', async (req, res, next) => {
  try {
    const { sellPrice, growthTime } = req.body;
    if (sellPrice !== undefined && typeof sellPrice === 'number' && sellPrice < 0) return res.status(400).json({ error: 'ValidationError', message: 'sellPrice cannot be negative' });
    if (growthTime !== undefined && typeof growthTime === 'number' && growthTime < 0) return res.status(400).json({ error: 'ValidationError', message: 'growthTime cannot be negative' });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'Item not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE item by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Item not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;