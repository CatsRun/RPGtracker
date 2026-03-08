const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// GET all locations
router.get('/', async (req, res) => {
  try {
    const locations = await Location.find().populate('npcsPresent');
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate('npcsPresent');
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new location
router.post('/', async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update location
router.put('/:id', async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE location
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Location not found' });
    }
    res.json({ message: 'Location deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
