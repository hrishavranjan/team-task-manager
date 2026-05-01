const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const router = express.Router();


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body; // ❌ removed role

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: "Member" // 🔥 always default
    });

    await user.save();

    res.json({ msg: "User registered successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================= PROTECTED =================
router.get("/protected", auth, (req, res) => {
  res.json({
    msg: "Protected route accessed",
    user: req.user
  });
});


// ================= ADMIN ONLY =================
router.get("/admin", auth, role("Admin"), (req, res) => {
  res.json({
    msg: "Admin access granted",
    user: req.user
  });
});

module.exports = router;