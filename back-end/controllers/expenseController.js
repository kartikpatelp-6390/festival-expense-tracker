const mongoose = require("mongoose");
const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
    try {
        const expense = await Expense.create(req.body);
        res.status(201).json({ message: "Expense recorded", data: expense });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Expense.findByIdAndUpdate(id, req.body, { new: true });
        res.json({ message: "Expense updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getFestivalExpense  = async (req, res) => {
    const { festivalId } = req.query;
    try {
        const query = festivalId ? { festivalId } : {};
        const expenses = await Expense.find(query).populate("festivalId").sort({ date: 1 });
        res.json(expenses);
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

module.exports = exports;