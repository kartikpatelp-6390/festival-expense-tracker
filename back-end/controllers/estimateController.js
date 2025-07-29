const mongoose = require("mongoose");
const Estimate = require("../models/Estimate");
const Festival = require("../models/Festival");
const queryHelper = require("../utils/queryHelper");

exports.addEstimate = async (req, res) => {
    try {
        const { festivalId } = req.body;

        // Fetch festivalYear from Festival collection
        if (festivalId) {
            const festival = await Festival.findById(festivalId);
            if (!festival) {
                return res.status(404).json({ error: "Festival not found" });
            }
            // Add festivalYear to request body
            req.body.festivalYear = festival.year;
        }

        const estimate = await Estimate.create(req.body);
        res.status(201).json({ message: "Estimate recorded", data: estimate });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateEstimate = async (req, res) => {
    try {
        const { id } = req.params
        const { festivalId } = req.body;

        // Fetch festivalYear from Festival collection
        if (festivalId) {
            const festival = await Festival.findById(festivalId);
            if (!festival) {
                return res.status(404).json({ error: "Festival not found" });
            }
            // Add festivalYear to request body
            req.body.festivalYear = festival.year;
        }

        const updated = await Estimate.findByIdAndUpdate(id, req.body, { new: true }).populate("festivalId");
        res.json({ message: "Estimate updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestivalEstimate  = async (req, res) => {
    try {
        let searchFields = ["name", "category", "description"]; // fields to search by text
        const populateOptions = ["festivalId"];

        req.query.festivalYear = req.query.festivalYear ? Number(req.query.festivalYear) : {};
        const result = await queryHelper(
            Estimate, req.query, searchFields, populateOptions
        );

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestivalEstimateById  = async (req, res) => {
    try {
        const { id } = req.params;
        const estimate = await Estimate.findById(id, req.body, { new: true })
            .populate("festivalId");
        res.json({ message: "Estimate detail", data: estimate });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSummary = async (req, res) => {
    const { festivalId } = req.query;
    try {
        const summary = await Estimate.aggregate([
            { $match: { festivalId: new mongoose.Types.ObjectId(festivalId) } },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$estimatedAmount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteEstimate = async (req, res) => {
    try {
        const { id } = req.params;
        await Estimate.findByIdAndDelete(id);
        res.json({ message: "Estimate deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Estimate.distinct("category");
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = exports;