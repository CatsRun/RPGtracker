// server.js
require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');

const app = express();
app.use(express.json());

// Mount routes
app.use('/', require('./routes/index'));

// Connect to DB
connectDB();

// Centralized error handler (must be after routes)
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) return next(err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'ValidationError', details });
  }

  // Invalid ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({ error: 'InvalidId', message: 'Provided id is invalid' });
  }

  // Default fallback
  res.status(500).json({ error: 'InternalServerError', message: 'An unexpected error occurred.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));