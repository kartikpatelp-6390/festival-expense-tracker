const FundTransaction = require("../models/FundTransaction");
const queryHelper = require("../utils/queryHelper");

exports.registerFund = async (req, res) => {
    try {
        const data = req.body;

        if (data.type === "house" && !data.houseId) {
            return res.status(400).json({ error: "houseId is required for type 'house'" });
        }

        const fund = await FundTransaction.create(data);
        const populated = await fund.populate("houseId");
        res.status(201).json({ message: "Fund saved", data: populated });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateFund = async (req, res) => {
    try {
        const { id } = req.params;
        const fund = await FundTransaction.findByIdAndUpdate(id, req.body, { new: true });
        const populated = await fund.populate("houseId");
        res.status(201).json({ message: "Fund updated", data: fund });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getFund = async (req, res) => {
    try {
        const { id } = req.params;
        const fund = await FundTransaction.findById(id, req.body, { new: true }).populate("houseId");
        res.json({ message: "Fund detail", data: fund });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.listFunds = async (req, res) => {
    try {
        let searchFields = ["name", "reference"]; // fields to search by text
        const populateOptions = ["houseId"];

        req.query.festivalYear = req.query.festivalYear ? Number(req.query.festivalYear) : {};
        const result = await queryHelper(
            FundTransaction, req.query, searchFields, populateOptions
        );

        // Post-process each fund record
        result.data = result.data.map(fund => {
            if (fund.type === 'house' && fund.houseId && fund.houseId.ownerName) {
                return {
                    ...fund.toObject(), // convert Mongoose doc to plain JS object
                    name: fund.houseId.ownerName
                };
            }
            return fund;
        });

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.summary = async (req, res) => {
    const { festivalYear } = req.query;
    try {
        const result = await FundTransaction.aggregate([
            { $match: { festivalYear: Number(festivalYear) } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteFund = async (req, res) => {
    try {
        const { id } = req.params;
        await FundTransaction.findByIdAndDelete(id);
        res.json({ message: "Fund deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};