const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");

// ADD PATIENT (UPGRADED)
router.post("/", auth, async (req, res) => {
  try {
    const { name, phone, age, gender, notes, medical_history } = req.body;

    const result = await pool.query(
      `INSERT INTO patients 
      (doctor_id, name, phone, age, gender, notes, medical_history)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *`,
      [
        req.user.id,
        name,
        phone,
        age,
        gender,
        notes,
        medical_history,
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Add patient error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET ALL PATIENTS
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients WHERE doctor_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch patients error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;