const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, async (req, res) => {
  try {
    const doctorId = req.user.id;

    // 🔢 TOTAL PATIENTS
    const patients = await pool.query(
      "SELECT COUNT(*) FROM patients WHERE doctor_id = $1",
      [doctorId]
    );

    // 🔢 TOTAL TASKS
    const tasks = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE doctor_id = $1",
      [doctorId]
    );

    // ✅ COMPLETED TASKS
    const completed = await pool.query(
      "SELECT COUNT(*) FROM tasks WHERE doctor_id = $1 AND status = 'completed'",
      [doctorId]
    );

    // ❌ MISSED TASKS (overdue)
    const missed = await pool.query(
      `SELECT COUNT(*) FROM tasks 
       WHERE doctor_id = $1 
       AND due_date < NOW() 
       AND status != 'completed'`,
      [doctorId]
    );

    // 📅 TODAY TASKS
    const today = await pool.query(
      `SELECT * FROM tasks 
       WHERE doctor_id = $1 
       AND DATE(due_date) = CURRENT_DATE`,
      [doctorId]
    );

    // 🔥 URGENT TASKS
    const urgent = await pool.query(
      `SELECT * FROM tasks 
       WHERE doctor_id = $1 
       AND priority = 'high' 
       AND status != 'completed'`,
      [doctorId]
    );

    // ⚠️ OVERDUE TASKS
    const overdue = await pool.query(
      `SELECT * FROM tasks 
       WHERE doctor_id = $1 
       AND due_date < NOW() 
       AND status != 'completed'`,
      [doctorId]
    );

    // 📊 CALCULATIONS
    const totalTasks = parseInt(tasks.rows[0].count);
    const completedTasks = parseInt(completed.rows[0].count);

    const completionRate =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    res.json({
      stats: {
        totalPatients: parseInt(patients.rows[0].count),
        totalTasks,
        completedTasks,
        missedTasks: parseInt(missed.rows[0].count),
        completionRate,
      },
      urgent: urgent.rows,
      overdue: overdue.rows,
      today: today.rows,
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;