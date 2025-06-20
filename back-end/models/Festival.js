const mongoose = require("mongoose");

const festivalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: Date,                     // optional festival date
    year: { type: Number, required: true },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model("Festival", festivalSchema);