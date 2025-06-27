const express = require("express");
const router = express.Router();
const {
    createVolunteer,
    getVolunteers,
    getVolunteer,
    updateVolunteer,
    deleteVolunteer,
} = require("../controllers/volunteerController");

// Add new volunteer
router.post("/", createVolunteer);

// Get all volunteers
router.get("/", getVolunteers);

// GET /api/volunteer/:id
router.get("/:id", getVolunteer);

// PUT /api/volunteer/:id
router.put("/:id", updateVolunteer);

// DELETE /api/volunteer/:id
router.delete("/:id", deleteVolunteer);

// TODO: Need to make update and delete API
module.exports = router;