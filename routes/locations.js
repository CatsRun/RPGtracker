// routes/locations.js
const express = require('express');
const router = express.Router();
const Location = require('../models/Location');
const ensureAuth = require('../middleware/ensureAuth');

// GET all locations
router.get('/', async (req, res, next) => {
  try {
    const locations = await Location.find().populate('npcsPresent');
    res.json(locations);
  } catch (err) { next(err); }
});

// GET location by ID
router.get('/:id', async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id).populate('npcsPresent');
    if (!location) return res.status(404).json({ error: 'NotFound', message: 'Location not found' });
    res.json(location);
  } catch (err) { next(err); }
});

// POST create new location (basic validation)
router.post('/', ensureAuth, async (req, res, next) => {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'ValidationError', message: 'name is required' });
    if (!req.body.type) return res.status(400).json({ error: 'ValidationError', message: 'type is required' });

    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) { next(err); }
});

// PUT update location (basic validation)
router.put('/:id', ensureAuth, async (req, res, next) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'Location not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE location
router.delete('/:id', ensureAuth, async (req, res, next) => {
  try {
    const deleted = await Location.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Location not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;