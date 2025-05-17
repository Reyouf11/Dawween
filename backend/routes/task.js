const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const cron = require("node-cron");
const sendReminderEmail = require("../utils/mailer");

router.post("/add", async (req, res) => {
  try {
    const taskData = req.body;

    const newTask = await Task.create(taskData);

    // Schedule email reminder
    scheduleReminder(newTask);

    res.status(201).json({ message: "Task added and reminder scheduled", task: newTask });
  } catch (error) {
    res.status(500).json({ message: "Error adding task", error });
  }
});

function scheduleReminder(task) {
  const reminderDate = new Date(new Date(task.taskTime) - task.reminderMinutes * 60000);

  const cronTime = `${reminderDate.getMinutes()} ${reminderDate.getHours()} ${reminderDate.getDate()} ${reminderDate.getMonth() + 1} *`;

  cron.schedule(cronTime, () => {
    sendReminderEmail(
      task.userEmail,
      `Reminder: ${task.title}`,
      `Don't forget your task "${task.title}" scheduled at ${task.taskTime}`
    );
  });

  console.log("⏰ Reminder scheduled for:", reminderDate);
}

module.exports = router;
