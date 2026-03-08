const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ['farm', 'shop', 'forest', 'beach', 'mine', 'home'],
        required: true
    },
    unlockedRequirements: [{ type: String }],
    npcsPresent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Character' }],
    resourcesAvailable: [{ type: String }],
});

module.exports = mongoose.model('Location', LocationSchema);