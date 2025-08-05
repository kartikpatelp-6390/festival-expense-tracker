const express = require('express');
const router = express.Router();
const {
    addInventory,
    getInventory,
    getInventoryById,
    updateInventory,
    deleteInventory,
    getCategories,
} = require('../controllers/inventoryController');


// POST /api/inventory
router.post("/", addInventory);

// GET /api/inventory
router.get("/", getInventory);

// GET /api/inventory/category
router.get("/category", getCategories);

// GET /api/inventory/:id
router.get("/:id", getInventoryById);

// PUT /api/inventory/:id
router.put("/:id", updateInventory);

// DELETE /api/inventory/:id
router.delete("/:id", deleteInventory);

module.exports = router;