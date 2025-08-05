const Inventory = require("../models/Inventory");
const queryHelper = require("../utils/queryHelper");
const Expense = require("../models/Expense");

exports.getInventory = async (req, res) => {
    try {
        const result = await queryHelper(
            Inventory, req.query, ["item", "category", "place"]
        );

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getInventoryById  = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await Inventory.findById(id, req.body, { new: true });

        if (!inventory) {
            res.status(404).json({ success:false, message: "Inventory not found" });
        }

        res.json({ message: "Inventory detail", data: inventory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addInventory = async (req, res) => {
    try {
        const todo = await Inventory.create(req.body);
        res.status(201).json({ data: todo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Inventory.findByIdAndUpdate(id, req.body, { new: true});
        res.json({ data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        await Inventory.findByIdAndDelete(id);
        res.json({ message: "Inventory Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getCategories = async (req, res) => {
    try {
        const categories = await Inventory.distinct("category");
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
