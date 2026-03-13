// routes/tasks.js
const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// GET all tasks
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().populate('assignedTo');
    res.json(tasks);
  } catch (err) { next(err); }
});

// GET task by ID
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignedTo');
    if (!task) return res.status(404).json({ error: 'NotFound', message: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
});

// POST create a new task (basic validation)
router.post('/', async (req, res, next) => {
  try {
    const { title, type } = req.body;
    if (!title) return res.status(400).json({ error: 'ValidationError', message: 'title is required' });
    if (!type) return res.status(400).json({ error: 'ValidationError', message: 'type is required' });

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// PUT update a task (basic validation)
router.put('/:id', async (req, res, next) => {
  try {
    if (req.body.status !== undefined) {
      const validStatuses = ['available', 'active', 'completed'];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({ error: 'ValidationError', message: 'status must be available, active, or completed' });
      }
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('assignedTo');
    if (!updated) return res.status(404).json({ error: 'NotFound', message: 'Task not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE a task
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'NotFound', message: 'Task not found' });
    res.status(204).send();
  } catch (err) { next(err); }
});

module.exports = router;