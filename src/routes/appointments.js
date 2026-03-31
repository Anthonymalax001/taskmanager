const express = require("express");
const router = express.Router();
const pool = require("../db");
const auth = require("../middleware/authMiddleware");
const sendEmail = require("../services/email");

// CREATE APPOINTMENT
router.post("/", auth, async (req, res) => {
  try {
    const { patient_id, title, appointment_date, appointment_time } = req.body;

    if (!patient_id || !title || !appointment_date || !appointment_time) {
      return res.status(400).json({ error: "All fields required" });
    }

    // 🚫 CHECK DOUBLE BOOKING
    const existing = await pool.query(
      `SELECT * FROM appointments
       WHERE doctor_id = $1 
       AND appointment_date = $2 
       AND appointment_time = $3`,
      [req.user.id, appointment_date, appointment_time]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Time slot already booked" });
    }

    // 📌 GET PATIENT
    const patientRes = await pool.query(
      "SELECT * FROM patients WHERE id = $1",
      [patient_id]
    );
    const patient = patientRes.rows[0];

    // 📌 GET DOCTOR
    const doctorRes = await pool.query(
      "SELECT * FROM doctors WHERE id = $1",
      [req.user.id]
    );
    const doctor = doctorRes.rows[0];

    // ✅ CREATE APPOINTMENT
    const result = await pool.query(
      `INSERT INTO appointments 
      (doctor_id, patient_id, title, appointment_date, appointment_time)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [req.user.id, patient_id, title, appointment_date, appointment_time]
    );

    const appointment = result.rows[0];

    // ✅ AUTO TASKS (SAFE: NO appointment_id dependency)
    try {
      await pool.query(
        `INSERT INTO tasks 
        (doctor_id, patient_id, title, priority, due_date)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          req.user.id,
          patient_id,
          "Review patient case",
          "high",
          appointment_date,
        ]
      );

      await pool.query(
        `INSERT INTO tasks 
        (doctor_id, patient_id, title, priority, due_date)
        VALUES ($1,$2,$3,$4,$5)`,
        [
          req.user.id,
          patient_id,
          "Write notes after visit",
          "medium",
          appointment_date,
        ]
      );
    } catch (taskErr) {
      console.error("Task creation failed:", taskErr.message);
    }

    // ✅ EMAIL (SAFE)
    try {
      if (doctor?.email) {
        await sendEmail(
          doctor.email,
          "📅 New Appointment Booked",
          `Hello Dr. ${doctor?.name || ""},

New appointment booked:

Patient: ${patient?.name || "Unknown"}
Date: ${appointment_date}
Time: ${appointment_time}
Title: ${title}

- Clinic System`
        );
      }
    } catch (emailErr) {
      console.error("Email failed:", emailErr.message);
    }

    res.json({
      appointment,
      message: "Appointment booked successfully",
    });

  } catch (err) {
    console.error("🔥 Appointment error FULL:", err);
    res.status(500).json({ error: err.message }); // 👈 VERY IMPORTANT FOR DEBUG
  }
});


// GET APPOINTMENTS
router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT appointments.*, patients.name AS patient_name
       FROM appointments
       JOIN patients ON appointments.patient_id = patients.id
       WHERE appointments.doctor_id = $1
       ORDER BY appointment_date ASC, appointment_time ASC`,
      [req.user.id]
    );

    res.json(result.rows || []);

  } catch (err) {
    console.error("Fetch appointments error:", err);
    res.status(500).json([]);
  }
});

module.exports = router;