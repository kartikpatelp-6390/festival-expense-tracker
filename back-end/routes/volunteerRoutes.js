const express = require("express");
const router = express.Router();
const {
    createVolunteer,
    getVolunteers
} = require("../controllers/volunteerController");

// Add new volunteer
router.post("/", createVolunteer);

// Get all volunteers
router.get("/", getVolunteers);

// TODO: Need to make update and delete API
module.exports = router;