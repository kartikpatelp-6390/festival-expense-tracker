const express = require("express");
const router = express.Router();
const {
    addExpense,
    updateExpense,
    deleteExpense,
    getFestivalExpense,
    getSummary,
    settleVolunteerExpenses,
    getCategories,
    getFestivalExpenseById,
} = require("../controllers/expenseController");

// POST /api/expenses — add expense
router.post("/", addExpense);

// PUT /api/expenses/settle
/**
 * Settle by expenseId
 * {
 *   "expenseId": "666cdeabc1234567890fed99",
 *   "isSettled": true
 * }
 *
 * Settle By festival and volunteer id
 * {
 *   "volunteerId": "666bcd1234567890efabcd11",
 *   "festivalId": "666abc1234567890fedcba99",
 *   "isSettled": false
 * }
 */
router.put("/settle", settleVolunteerExpenses);

// PUT /api/expenses/:id
router.put("/:id", updateExpense);

// GET /api/expenses/categories
router.get("/categories", getCategories);

// GET /api/expenses/:id
router.get("/:id", getFestivalExpenseById);

// DELETE /api/expenses/:id
router.delete("/:id", deleteExpense);

// GET /api/expenses?festivalId=...
router.get("/", getFestivalExpense);

// GET /api/expenses/summary?festivalId=...
router.get("/summary", getSummary);

module.exports = router;
