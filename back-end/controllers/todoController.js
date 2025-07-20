const Todo = require("../models/Todo");
const queryHelper = require("../utils/queryHelper");

exports.getTodos = async (req, res) => {
    try {
        const result = await queryHelper(
            Todo, req.query, ["title"]
        );

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addTodo = async (req, res) => {
    try {
        const todo = await Todo.create({
            title: req.body.title,
            role: req.user.role,
            createdBy: req.user.id,
        });
        res.status(201).json({ data: todo });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Todo.findOneAndUpdate(
            { _id: id, createdBy: req.user.id },  // only own todo
            req.body,
            { new: true }
        );
        res.json({ data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        await Todo.deleteOne({ _id: req.params.id, createdBy: req.user.id });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
