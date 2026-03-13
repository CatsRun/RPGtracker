// routes/character.js
const express = require('express');
const router = express.Router();
const Character = require('../models/character');

// GET all characters
router.get('/', async (req, res, next) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) { next(err); }
});

// GET a single character by ID
router.get('/:id', async (req, res, next) => {
  try {
    const character = await Character.findById(req.params.id);
    if (!character) return res.status(404).json({ error: 'NotFound', message: 'Character not found' });
    res.json(character);
  } catch (err) { next(err); }
});

// POST create character (basic validation)
router.post('/', async (req, res, next) => {
  try {
    // VALIDATION
    if (!req.body.name) {
      return res.status(400).json({ error: 'ValidationError', message: 'name is required' });
    }
    if (req.body.friendshipLevel !== undefined && req.body.friendshipLevel < 0) {
      return res.status(400).json({ error: 'ValidationError', message: 'friendshipLevel cannot be negative' });
    }

    const character = await Character.create(req.body);
    res.status(201).json(character);
  } catch (err) { next(err); }
});

// PUT update character by ID (basic validation)
router.put('/:id', async (req, res, next) => {
  try {
    if (req.body.friendshipLevel !== undefined && req.body.friendshipLevel < 0) {
      return res.status(400).json({ error: 'ValidationError', message: 'friendshipLevel cannot be negative' });
    }

    const character = await Character.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!character) return res.status(404).json({ error: 'NotFound', message: 'Character not found' });
    res.json(character);
  } catch (err) { next(err); }
});

// DELETE character by ID
router.delete('/:id', async (req, res, next) => {
  try {
    const character = await Character.findByIdAndDelete(req.params.id);
    if (!character) return res.status(404).json({ error: 'NotFound', message: 'Character not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;