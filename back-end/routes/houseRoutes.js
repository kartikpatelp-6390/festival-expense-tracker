const express = require('express');
const router = express.Router();
const House = require('../models/House');

// Create new House
router.post('/', async (req, res) => {
    try {
        const { houseNumber, ownerName, phone, address } = req.body;

        if (!houseNumber) {
            return res.status(400).json({ error: "houseNumber is required" });
        }

        const normalizedHouseNumber = houseNumber.trim().toUpperCase();

        // Check if house already exists
        let house = await House.findOne({ houseNumber: normalizedHouseNumber });

        if (house) {
            // Update existing house
            house.ownerName = ownerName ?? house.ownerName;
            house.phone = phone ?? house.phone;

            const updatedHouse = await house.save();
            return res.status(200).json({
                message: "House updated successfully",
                data: updatedHouse
            });
        } else {
            // Create new house
            const newHouse = new House({
                houseNumber: normalizedHouseNumber,
                ownerName,
                phone,
            });

            const savedHouse = await newHouse.save();
            return res.status(201).json({
                message: "House created successfully",
                data: savedHouse
            });
        }

    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

// Get all houses
router.get("/", async (req, res) => {
    try {
        const houses = await House.find();
        res.json(houses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;