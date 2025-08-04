const express = require("express");
const router = express.Router();
const {
    registerFund,
    listFunds,
    summary,
    getFund,
    updateFund,
    deleteFund,
    downloadReceipt,
    getUnregisteredHouses,
    getSummaryByVolunteers,
} = require("../controllers/fundTransationController");

// POST /api/funds — Add a new fund entry
router.post("/", registerFund);

// Get /api/funds/update?festivalYear=2025
router.get('/unpaid', getUnregisteredHouses)

// GET /api/funds/summary-by-volunteers?festivalYear=2025 — income grouped by type
router.get("/summary-by-volunteers", getSummaryByVolunteers);

// GET /api/funds/:id
router.get("/:id", getFund);

// PUT /api/funds/:id
router.put("/:id", updateFund);

// GET /api/funds?festivalYear=2025 — List all fund entries for a festivalYear
router.get("/", listFunds);

// GET /api/funds/summary?festivalYear=2025 — income grouped by type
router.get("/summary", summary);

// DELETE /api/funds/:id
router.delete("/:id", deleteFund);

// GET /api/funds/download/:id/receipt - downloadReceipt
router.get("/download/:id", downloadReceipt);



module.exports = router;