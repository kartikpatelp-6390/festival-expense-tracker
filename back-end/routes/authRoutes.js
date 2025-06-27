const express = require("express");
const router = express.Router();
const { register, login, logout } = require("../controllers/authController");

router.post("/register", register); // One-time use for admin
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;