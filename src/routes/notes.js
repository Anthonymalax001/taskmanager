const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// ADD NOTE
router.post("/", auth, async (req, res) => {
  try {
    const { patient_id, content } = req.body;

    const result = await pool.query(
      `INSERT INTO notes (patient_id, doctor_id, content)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [patient_id, req.user.id, content]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET NOTES FOR A PATIENT
router.get("/:patient_id", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM notes 
       WHERE patient_id = $1 
       AND doctor_id = $2
       ORDER BY created_at DESC`,
      [req.params.patient_id, req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;