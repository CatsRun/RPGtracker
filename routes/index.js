// routes/index.js
const express = require('express');
const router = express.Router();
const ensureAuth = require("../middleware/ensureAuth");

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RPG Tracker API' });
});

// Protect all API routes
router.use('api', ensureAuth);

// mount resource routers under /api
router.use('/api/characters', require('./characters'));
router.use('/api/items', require('./items'));
router.use('/api/tasks', require('./tasks'));
router.use('/api/locations', require('./locations'));
router.use('/', require('./swagger'));

module.exports = router;