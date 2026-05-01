const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const auth = require("../middleware/authMiddleware");

// ================= CREATE PROJECT =================
router.post("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name required" });
    }

    const project = new Project({
      name,
      createdBy: req.user.id,
      members: [req.user.id]
    });

    await project.save();
    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: "Error creating project" });
  }
});

// ================= GET PROJECTS =================
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("members", "name");

    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching projects" });
  }
});

// ================= ADD MEMBER =================
router.put("/:id/add-member", auth, async (req, res) => {
  try {
    const { userId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    if (!project.members.includes(userId)) {
      project.members.push(userId);
    }

    await project.save();
    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: "Error adding member" });
  }
});

// ================= UPDATE PROJECT =================
router.put("/:id", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    res.json(project);

  } catch (err) {
    res.status(500).json({ msg: "Error updating project" });
  }
});

// ================= DELETE PROJECT =================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: "Project deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting project" });
  }
});

module.exports = router;