// backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location: { type: String, default: 'Online' },
  date: { type: Date, required: true },
  capacity: { type: Number, default: 100 },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isCancelled: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
