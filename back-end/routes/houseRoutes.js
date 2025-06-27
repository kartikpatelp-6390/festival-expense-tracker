const express = require('express');
const router = express.Router();
const House = require('../models/House');
const {
    createHouse,
    getAllHouses,
    getHouse,
    updateHouse
} = require("../controllers/houseController");


// POST /api/house
router.post("/", createHouse);

// GET /api/house
router.get("/", getAllHouses);

// GET /api/house/:id
router.get("/:id", getHouse);

// PUT /api/house/:id
router.put("/:id", updateHouse);

module.exports = router;