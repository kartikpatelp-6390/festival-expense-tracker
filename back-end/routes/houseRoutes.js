const express = require('express');
const router = express.Router();
const House = require('../models/House');
const {
    createHouse,
    getAllHouses,
    getHouse,
    updateHouse,
    deleteHouse,
} = require("../controllers/houseController");


// POST /api/house
router.post("/", createHouse);

// GET /api/house
router.get("/", getAllHouses);

// GET /api/house/:id
router.get("/:id", getHouse);

// PUT /api/house/:id
router.put("/:id", updateHouse);

// DELETE /api/house/:id
router.delete("/:id", deleteHouse);

module.exports = router;