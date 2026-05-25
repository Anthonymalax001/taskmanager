import { useEffect, useState } from "react";

const API = "https://taskmanager-production-a175.up.railway.app";

export default function Appointments({ token }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // FETCH PATIENTS
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setPatients([]);
    }
  };

  // FETCH APPOINTMENTS
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API}/api/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  // CREATE APPOINTMENT
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

      alert("✅ Appointment created");

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
    <div
      style={{
        maxWidth: "900px",
        margin: "20px auto",
        padding: "10px",
      }}
    >
      {/* CREATE CARD */}
      <div style={styles.card}>
        <h2 style={styles.heading}> Book Appointment</h2>

        <input
          placeholder="Appointment title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          style={styles.input}
        >
          <option value="">Select patient</option>

          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.input}
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          style={styles.input}
        />

        <button onClick={createAppointment} style={styles.button}>
          Book Appointment
        </button>
      </div>

      {/* APPOINTMENTS LIST */}
      <div>
        <h2 style={styles.sectionTitle}>Appointments</h2>

        {appointments.length === 0 ? (
          <div style={styles.empty}>
            No appointments yet
          </div>
        ) : (
          appointments.map((a) => (
            <div key={a.id} style={styles.item}>
              <h3 style={{ marginBottom: "8px" }}>
                {a.title}
              </h3>

              <p style={styles.text}>
                 {a.patient_name}
              </p>

              <p style={styles.text}>
                 {a.appointment_date}
              </p>

              <p style={styles.text}>
                 {a.appointment_time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    marginBottom: "25px",
  },

  heading: {
    marginBottom: "20px",
    color: "#1e293b",
    fontSize: "24px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  sectionTitle: {
    marginBottom: "15px",
    color: "#1e293b",
  },

  item: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  text: {
    margin: "4px 0",
    color: "#475569",
  },

  empty: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    color: "#64748b",
  },
};