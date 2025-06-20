const express = require("express");
const router = express.Router();
const {
    registerFund,
    listFunds,
    summary
} = require("../controllers/fundTransationController");

// POST /api/funds — Add a new fund entry
router.post("/", registerFund);

// GET /api/funds?year=2025 — List all fund entries for a year
router.get("/", listFunds);

// GET /api/funds/summary?year=2025 — income grouped by type
router.get("/summary", summary);

module.exports = router;