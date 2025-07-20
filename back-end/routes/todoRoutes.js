const express = require('express');
const router = express.Router();
const {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todoController');


// POST /api/house
router.post("/", addTodo);

// GET /api/house
router.get("/", getTodos);

// PUT /api/house/:id
router.put("/:id", updateTodo);

// DELETE /api/house/:id
router.delete("/:id", deleteTodo);

module.exports = router;