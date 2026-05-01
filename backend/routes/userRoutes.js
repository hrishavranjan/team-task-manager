const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

// 🔥 Get all users (Admin only)
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const users = await User.find().select("-password");
  res.json(users);
});

// 🔥 Update role
router.put("/:id", auth, async (req, res) => {
  if (req.user.role !== "Admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role },
    { new: true }
  );

  res.json(user);
});

module.exports = router;