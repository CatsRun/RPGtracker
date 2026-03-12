const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the RPG Tracker API' });
});

router.use('/characters', require('./characters'));
router.use('/items', require('./items'));
router.use('/tasks', require('./tasks'));
router.use('/locations', require('./locations'));   
router.use('/', require('./swagger'));

module.exports = router;