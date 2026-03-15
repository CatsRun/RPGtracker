// routes/index.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RPG Tracker API' });
});

// mount resource routers under /api
router.use('/api/characters', require('./characters'));
router.use('/api/items', require('./items'));
router.use('/api/tasks', require('./tasks'));
router.use('/api/locations', require('./locations'));
router.use('/', require('./swagger'));

module.exports = router;