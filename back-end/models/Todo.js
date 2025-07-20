const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    isDone: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // or Volunteer
    role: { type: String, enum: ['admin', 'volunteer'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
