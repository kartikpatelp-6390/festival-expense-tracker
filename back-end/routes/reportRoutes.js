const express = require("express");
const router = express.Router();
const {
    getYearlyReport,
    festivalBreakDownReport
} = require("../controllers/reportController");

// GET /api/report/yearly?year=2025
router.get("/", getYearlyReport);

// GET /api/report/festival-breakdown?year=2025
router.get("/festival-breakdown", festivalBreakDownReport);

module.exports = router;