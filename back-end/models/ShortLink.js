const mongoose = require('mongoose');

const shortLinkSchema = new mongoose.Schema({
    key: { type: String, unique: true, required: true },
    targetUrl: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ShortLink', shortLinkSchema);
