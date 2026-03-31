import { useEffect, useState } from "react";

const API = "https://taskmanager-u3hl.onrender.com";

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
      const res = await fetch(`${API}/api/patients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Patients error:", err);
      setPatients([]);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) return;

      const data = await res.json();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Appointments error:", err);
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
      const res = await fetch(`${API}/api/appointments`, {
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

      if (!res.ok) {
        alert(data.error || "Failed to create appointment");
        return;
      }

      alert("✅ Appointment created!");

      setTitle("");
      setPatientId("");
      setDate("");
      setTime("");

      fetchAppointments();

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>

      {/* CREATE */}
      <div style={card}>
        <h2>📅 Book Appointment</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={input}
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={input}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={input}
        />

        <button onClick={createAppointment} style={button}>
          Book Appointment
        </button>
      </div>

      {/* LIST */}
      <h2>Appointments</h2>

      {appointments.length === 0 ? (
        <p>No appointments</p>
      ) : (
        appointments.map((a) => (
          <div key={a.id} style={item}>
            <strong>{a.title}</strong>
            <p>👤 {a.patient_name}</p>
            <p>📅 {a.appointment_date} | ⏰ {a.appointment_time}</p>
          </div>
        ))
      )}
    </div>
  );
}

// styles
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "30px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ddd"
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
};

const item = {
  border: "1px solid #ddd",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  background: "#fff"
};