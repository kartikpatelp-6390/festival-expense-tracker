const FundTransaction = require("../models/FundTransaction");
const House = require("../models/House");

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

exports.listFunds = async (req, res) => {
    const { year } = req.query;
    try {
        const query = year ? { festivalYear: Number(year) } : {};
        const funds = await FundTransaction.find(query).populate("houseId").sort({ date: 1 });
        res.json(funds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.summary = async (req, res) => {
    const { year } = req.query;
    try {
        const result = await FundTransaction.aggregate([
            { $match: { festivalYear: Number(year) } },
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