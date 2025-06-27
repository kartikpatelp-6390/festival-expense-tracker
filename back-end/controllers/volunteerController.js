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

exports.getVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        const house = await Volunteer.findById(id, req.body, { new: true });
        res.json({ message: "Volunteer detail", data: house });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Volunteer.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Volunteer updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteVolunteer = async (req, res) => {
    try {
        const { id } = req.params;
        await Volunteer.findByIdAndDelete(id);
        res.json({ message: "Volunteer deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports;