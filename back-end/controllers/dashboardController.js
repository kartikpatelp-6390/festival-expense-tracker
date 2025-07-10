const mongoose = require("mongoose");
const Fund = require("../models/FundTransaction");
const Expense = require("../models/Expense");
const queryHelper = require("../utils/queryHelper");
const FundTransaction = require("../models/FundTransaction");

exports.paymentMethodBifurcation = async (req, res) => {
    try {

        const { festivalYear } = req.query;
        const yearFilter = festivalYear ? { festivalYear: Number(festivalYear) } : {};

        const fund = await FundTransaction.aggregate([
            { $match: yearFilter },
            {
                $group: {
                    _id: "$paymentMethod",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const expense = await Expense.aggregate([
            { $match: yearFilter },
            {
                $group: {
                    _id: "$paymentMethod",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        res.status(200).send({ fund, expense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = exports;