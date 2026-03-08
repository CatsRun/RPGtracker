require('dotenv').config();
const express = require('express');
const connectDB = require('./db/connect');

const app = express();
app.use(express.json());

app.use('/api/characters', require('./routes/characters'));
app.use('/api/items', require('./routes/items'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/locations', require('./routes/locations'));

connectDB();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});