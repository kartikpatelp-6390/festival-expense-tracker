const express = require("express");
const router = express.Router();
const {
    paymentMethodBifurcation
} = require("../controllers/dashboardController");

// POST /api/dashboard/ — add expense
router.get("/paymentMethodBifurcation", paymentMethodBifurcation);

module.exports = router;
