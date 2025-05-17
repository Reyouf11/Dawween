const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  userEmail: String,
  taskTime: Date,
  reminderMinutes: Number
});

module.exports = mongoose.model("Task", TaskSchema);
