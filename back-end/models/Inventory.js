const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    item: { type: String, required: true },
    category: { type: String, required: true },
    count: { type: Number, required: true },
    place: { type: String, required: true },
    note: { type: String },
}, {timestamps: true});

module.exports = mongoose.model('Inventory', inventorySchema);