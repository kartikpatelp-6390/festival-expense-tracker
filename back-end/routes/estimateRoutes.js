const express = require("express");
const router = express.Router();
const {
    addEstimate,
    updateEstimate,
    deleteEstimate,
    getFestivalEstimate,
    getSummary,
    getCategories,
    getFestivalEstimateById,
} = require("../controllers/estimateController");

// POST /api/expenses — add expense
router.post("/", addEstimate);

// PUT /api/expenses/:id
router.put("/:id", updateEstimate);

// GET /api/expenses/categories
router.get("/categories", getCategories);

// GET /api/expenses/:id
router.get("/:id", getFestivalEstimateById);

// DELETE /api/expenses/:id
router.delete("/:id", deleteEstimate);

// GET /api/expenses?festivalId=...
router.get("/", getFestivalEstimate);

// GET /api/expenses/summary?festivalId=...
router.get("/summary", getSummary);

module.exports = router;
