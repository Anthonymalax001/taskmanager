const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, clinic_name } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    // Check if doctor exists
    const userCheck = await pool.query(
      "SELECT * FROM doctors WHERE email = $1",
      [email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: "Doctor already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert doctor
    const result = await pool.query(
      `INSERT INTO doctors (name, email, password, clinic_name) 
       VALUES ($1,$2,$3,$4) 
       RETURNING *`,
      [name, email, hashedPassword, clinic_name]
    );

    const doctor = result.rows[0];

    // ✅ CREATE TOKEN (FIX)
    const token = jwt.sign(
      { id: doctor.id },
      process.env.JWT_SECRET
    );

    // ✅ RETURN TOKEN
    res.json({ token });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM doctors WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Doctor not found" });
    }

    const doctor = result.rows[0];

    const valid = await bcrypt.compare(password, doctor.password);

    if (!valid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { id: doctor.id },
      process.env.JWT_SECRET
    );

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;