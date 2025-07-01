const express = require("express");
const router = express.Router();
const {
    createFestival,
    getFestivalsByYear,
    updateFestival,
    deleteFestival,
    getFestival,
} = require("../controllers/festivalController");

// POST /api/festivals
router.post("/", createFestival);

// GET /api/festivals?year=2025
router.get("/", getFestivalsByYear);

// GET /api/festivals/:id
router.get("/:id", getFestival);

// PUT /api/festivals/:id
router.put("/:id", updateFestival);

// DELETE /api/festivals/:id
router.delete("/:id", deleteFestival);

module.exports = router;
