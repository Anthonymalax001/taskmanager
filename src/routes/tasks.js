const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// ✅ CREATE TASK + AUTO FOLLOW-UP
router.post("/", auth, async (req, res) => {
  try {
    const { patient_id, title, description, priority, due_date } = req.body;

    // 1. Create main task
    const result = await pool.query(
      `INSERT INTO tasks 
      (doctor_id, patient_id, title, description, priority, due_date)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [req.user.id, patient_id, title, description, priority, due_date]
    );

    const mainTask = result.rows[0];

    // 2. AUTO FOLLOW-UP (2 days later)
    if (due_date) {
      const followUpDate = new Date(due_date);
      followUpDate.setDate(followUpDate.getDate() + 2);

      await pool.query(
        `INSERT INTO tasks 
        (doctor_id, patient_id, title, priority, due_date)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          req.user.id,
          patient_id,
          `Follow-up: ${title}`,
          "low",
          followUpDate,
        ]
      );
    }

    res.json(mainTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET TASKS WITH PATIENT NAME
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT tasks.*, patients.name AS patient_name
       FROM tasks
       JOIN patients ON tasks.patient_id = patients.id
       WHERE tasks.doctor_id = $1
       ORDER BY tasks.due_date ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ MARK TASK AS COMPLETED
router.put("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET status = 'completed'
       WHERE id = $1 AND doctor_id = $2
       RETURNING *`,
      [req.params.id, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;