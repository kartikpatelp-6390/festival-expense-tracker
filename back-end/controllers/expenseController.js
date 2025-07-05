const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Festival = require("../models/Festival");
const queryHelper = require("../utils/queryHelper");
const FundTransaction = require("../models/FundTransaction");

exports.addExpense = async (req, res) => {
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

        const expense = await Expense.create(req.body);
        res.status(201).json({ message: "Expense recorded", data: expense });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateExpense = async (req, res) => {
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

        const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true }).populate("festivalId");
        res.json({ message: "Expense updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestivalExpense  = async (req, res) => {
    try {
        let searchFields = ["name", "category", "description"]; // fields to search by text
        const populateOptions = ["festivalId", "volunteerId"];

        req.query.festivalYear = req.query.festivalYear ? Number(req.query.festivalYear) : {};
        const result = await queryHelper(
            Expense, req.query, searchFields, populateOptions
        );

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestivalExpenseById  = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findById(id, req.body, { new: true })
            .populate("festivalId").populate("volunteerId");
        res.json({ message: "Expense detail", data: expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSummary = async (req, res) => {
    const { festivalId } = req.query;
    try {
        const summary = await Expense.aggregate([
            { $match: { festivalId: new mongoose.Types.ObjectId(festivalId) } },
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.settleVolunteerExpenses = async (req, res) => {
    const { expenseId, volunteerId, festivalId, isSettled } = req.body;

    if (typeof isSettled !== "boolean") {
        return res.status(400).json({ error: "Missing or invalid 'isSettled' boolean" });
    }

    let filter = {};
    let scope = "";

    try {
        // Settle by expenseId
        if (expenseId) {
            filter._id = new mongoose.Types.ObjectId(expenseId);
            scope = "single expense";

        } else if (volunteerId) {
            // Settle all by volunteer (+ optional festival)
            filter.volunteerId = new mongoose.Types.ObjectId(volunteerId);
            filter.isSettled = { $ne: isSettled }; // Only update if not already in desired state

            if (festivalId) {
                filter.festivalId = new mongoose.Types.ObjectId(festivalId);
                scope = `volunteer + festival`;
            } else {
                scope = `volunteer (all festivals)`;
            }

        } else {
            return res.status(400).json({ error: "Pass either 'expenseId' or 'volunteerId'" });
        }

        // Only update if expense has volunteerId
        filter.volunteerId = { $exists: true, $ne: null };

        const update = {
            isSettled: isSettled,
            settledOn: isSettled ? new Date() : null
        };

        const result = await Expense.updateMany(filter, update);

        res.json({
            message: `Updated ${result.modifiedCount} expense(s) for ${scope}`,
            modifiedCount: result.modifiedCount
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        await Expense.findByIdAndDelete(id);
        res.json({ message: "Expense deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Expense.distinct("category");
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = exports;