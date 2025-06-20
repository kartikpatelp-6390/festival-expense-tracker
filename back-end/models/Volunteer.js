const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: String
}, { timestamps: true });

module.exports = mongoose.model("Volunteer", volunteerSchema);
