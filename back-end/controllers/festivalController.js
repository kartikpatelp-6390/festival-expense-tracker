const Festival = require("../models/Festival");

exports.createFestival = async (req, res) => {
    try {
        const { name, date, year, notes } = req.body;

        const existing = await Festival.findOne({ name, year });
        if (existing) {
            return res.status(400).json({ error: "Festival already exists for this year" });
        }

        const festival = await Festival.create({ name, date, year, notes });
        res.status(201).json({ message: "Festival created", data: festival });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestivalsByYear = async (req, res) => {
    try {
        const { year } = req.query;
        const filter = year ? { year: Number(year) } : {};
        const festivals = await Festival.find(filter).sort({ date: 1 });
        res.json(festivals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateFestival = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Festival.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Festival updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFestival = async (req, res) => {
    try {
        const { id } = req.params;
        await Festival.findByIdAndDelete(id);
        res.json({ message: "Festival deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
