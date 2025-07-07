const Volunteer = require("../models/Volunteer");
const queryHelper = require('../utils/queryHelper');
const normalizePhone = require('../utils/commonUtils');
const bcrypt = require("bcryptjs");

exports.createVolunteer = async (req, res) => {
    try {

        // if role is admin then only create volunteer
        if (req.user.role === "volunteer") {
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await volunteerAddUpdate(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getVolunteers = async (req, res) => {
    try {
        const result = await queryHelper(
            Volunteer, req.query, ["name"]
        );

        res.json({ success: true, ...result });
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

        // Volunteers can only update themselves
        if (req.user.role === 'volunteer' && req.user.id.toString() !== id) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await volunteerAddUpdate(req.body, id);
        res.status(201).json(result);
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

async function volunteerAddUpdate(data, id = null) {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }

    const finalPhone = normalizePhone(data.phone);
    const formData = {
        ...data,
        phone: finalPhone,
    }

    if (id) {
        const updated = await Volunteer.findByIdAndUpdate(id, formData, {new: true});
        return { message: "Volunteer updated", data: updated };
    } else {
        const created = await Volunteer.create(formData);
        return { message: "Volunteer created", data: created };
    }
}

module.exports;