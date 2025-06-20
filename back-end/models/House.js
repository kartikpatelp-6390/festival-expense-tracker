const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    houseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    ownerName: String,
    phone: String,
}, {timestamps: true});

module.exports = mongoose.model('House', houseSchema);