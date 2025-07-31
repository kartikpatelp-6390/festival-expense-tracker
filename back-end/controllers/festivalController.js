const Festival = require("../models/Festival");
const queryHelper = require("../utils/queryHelper");
const House = require("../models/House");

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
        req.query.year = req.query.year ? Number(req.query.year) : {};

        const queryParams = {
            ...req.query,
            sort: '-year'
        }

        const result = await queryHelper(
            Festival, queryParams, ["name"]
        );

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestival = async (req, res) => {
    try {
        const { id } = req.params;
        const festival = await Festival.findById(id, req.body, { new: true });
        res.json({ message: "Festival detail", data: festival });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

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
