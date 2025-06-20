const Volunteer = require("../models/Volunteer");

exports.createVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.create(req.body);
        res.status(201).json({ message: "Volunteer added", data: volunteer });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ name: 1 });
        res.json(volunteers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports;