const express = require("express");
const router = express.Router();
const {
    createFestival,
    getFestivalsByYear,
    updateFestival,
    deleteFestival
} = require("../controllers/festivalController");

// POST /api/festivals
router.post("/", createFestival);

// GET /api/festivals?year=2025
router.get("/", getFestivalsByYear);

// PUT /api/festivals/:id
router.put("/:id", updateFestival);

// DELETE /api/festivals/:id
router.delete("/:id", deleteFestival);

module.exports = router;
