const mongoose = require('mongoose');

const estimateSchema = new mongoose.Schema({
    festivalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Festival",
        required: true
    },
    festivalYear: { type: Number, required: true },
    description: { type: String },
    estimatedAmount: { type: Number, required: true },
    category: { type: String }, // e.g., decoration, food
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Estimate', estimateSchema);