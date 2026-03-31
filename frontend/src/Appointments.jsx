import { useEffect, useState } from "react";

export default function Appointments({ token }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPatients();
      fetchAppointments();
    }
  }, [token]);

  // Create appointment
  const createAppointment = async () => {
    if (!title || !patientId || !date || !time) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          patient_id: patientId,
          appointment_date: date,
          appointment_time: time,
        }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
        return;
      }

      alert("Appointment created!");

      setTitle("");
      setPatientId("");
      setDate("");
      setTime("");

      fetchAppointments();

    } catch (err) {
      console.error(err);
      alert("Failed to create appointment");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px"
      }}>
        <h2>📅 Book Appointment</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        /><br />

        <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select><br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        /><br />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        /><br />

        <button onClick={createAppointment}>Book</button>
      </div>

      <h2>Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id} style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px"
          }}>
            <strong>{a.title}</strong>
            <p>Patient: {a.patient_name}</p>
            <p>{a.appointment_date} at {a.appointment_time}</p>
          </div>
        ))
      )}
    </div>
  );
}