const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: {
        type: String,
        enum: ['daily', 'seasonal', 'villager', 'festival'],
        required: true
    },
    requirements: { type: [String], default: [] },
    rewards: { type: [String], default: [] },
    status: {
        type: String,
        enum: ['available', 'active', 'completed'],
        default: 'available'
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' }
});

module.exports = mongoose.model('Task', TaskSchema);