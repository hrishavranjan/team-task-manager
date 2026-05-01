const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// ================= CREATE TASK =================
router.post("/", auth, async (req, res) => {
  try {
    const { title, assignedTo, project, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ msg: "Title is required" });
    }

    let task;

    if (req.user.role === "Admin") {
      // 👑 Admin can assign task to anyone
      task = new Task({
        title,
        description,
        assignedTo,
        project,
        dueDate,
        createdBy: req.user.id
      });
    } else {
      // 👤 Member → task auto assigned to self
      task = new Task({
        title,
        description,
        assignedTo: req.user.id,
        project,
        dueDate,
        createdBy: req.user.id
      });
    }

    await task.save();
    res.json(task);

  } catch (err) {
    console.log("CREATE TASK ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ================= GET TASKS =================
router.get("/", auth, async (req, res) => {
  try {
    let tasks;

    if (req.user.role === "Admin") {
      // 👑 Admin → all tasks
      tasks = await Task.find()
        .populate("assignedTo", "name")
        .populate("project", "name");
    } else {
      // 👤 Member → only their tasks
      tasks = await Task.find({ assignedTo: req.user.id })
        .populate("assignedTo", "name")
        .populate("project", "name");
    }

    res.json(tasks);

  } catch (err) {
    console.log("GET TASK ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ================= UPDATE STATUS =================
router.put("/:id", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    // 👤 Member can only update their own task
    if (
      req.user.role !== "Admin" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({ msg: "Access denied" });
    }

    task.status = status;
    await task.save();

    res.json(task);

  } catch (err) {
    console.log("UPDATE TASK ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;