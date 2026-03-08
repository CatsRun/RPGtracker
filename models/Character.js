const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  friendshipLevel: { type: Number, default: 0 },
  favoriteItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  dailySchedule: [{ type: String }],
  unlockedEvents: [{ type: String }]
});

module.exports = mongoose.model('Character', CharacterSchema);