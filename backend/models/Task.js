const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },

  description: { 
    type: String, 
    default: "" 
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    default: null
  },

  // 🔥 IMPORTANT (you were missing this)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  dueDate: { 
    type: Date, 
    default: null 
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);