const House = require('../models/House');
const Festival = require("../models/Festival");
const queryHelper = require("../utils/queryHelper");
const normalizePhone = require('../utils/commonUtils');
const Volunteer = require("../models/Volunteer");

exports.createHouse = async (req, res) => {
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

            if (house.phone) {
                house.phone = normalizePhone(house.phone);
            }

            const updatedHouse = await house.save();
            return res.status(200).json({
                message: "House updated successfully",
                data: updatedHouse
            });
        } else {

            let finalPhone = phone;
            if (phone) {
                finalPhone = normalizePhone(phone);
            }

            // Create new house
            const newHouse = new House({
                houseNumber: normalizedHouseNumber,
                ownerName,
                finalPhone,
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
}

exports.getAllHouses = async (req, res) => {
    try {
        const result = await queryHelper(
            House, req.query, ["ownerName", "houseNumber", "phone"]
        );

        res.json({ success: true, ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getHouse = async (req, res) => {
    try {
        const { id } = req.params;
        const house = await House.findById(id, req.body, { new: true });
        res.json({ message: "House detail", data: house });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateHouse = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.phone) {
            req.body.phone = normalizePhone(req.body.phone);
        }

        const formData = {
            ...req.body,
        }

        const updated = await House.findByIdAndUpdate(id, formData, { new: true });
        res.json({ message: "House updated", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteHouse = async (req, res) => {
    try {
        const { id } = req.params;
        await House.findByIdAndDelete(id);
        res.json({ message: "House deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = exports