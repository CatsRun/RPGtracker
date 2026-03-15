// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RPG Tracker API' });
});

// mount resource routers under /api
router.use('/api/characters', require('./Characters'));
router.use('/api/items', require('./Items'));
router.use('/api/tasks', require('./Tasks'));
router.use('/api/locations', require('./Locations'));
router.use('/', require('./swagger'));

module.exports = router;