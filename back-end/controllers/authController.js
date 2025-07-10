const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Volunteer = require("../models/Volunteer");
const generateToken = require("../utils/generateToken");

// Register new admin
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ username, password: hashedPassword });

        res.status(201).json({ message: "User registered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login admin
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

            const adminRole = (username === "admin") ? "admin" : "non-admin";
            const token = generateToken(user._id, adminRole);
            return res.json({
                token,
                role: adminRole,
                user: { id: user._id, name: user.username }
            });
        }

        // Try volunteer
        let volunteer = await Volunteer.findOne({ phone: username }); // username = phone
        if (!volunteer) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, volunteer.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        const token = generateToken(volunteer._id, "volunteer");
        return res.json({
            token,
            role: "volunteer",
            user: { id: volunteer._id, name: volunteer.name, phone: volunteer.phone }
        });


    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logout admin
exports.logout = async (req, res) => {
  try {
      return res.status(200).json({ message: "Logged out successfully" });
  }  catch (err) {
      res.status(500).json({ error: err.message });
  }
};
