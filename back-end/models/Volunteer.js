const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
