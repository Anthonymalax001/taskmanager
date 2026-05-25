import { useEffect, useState } from "react";

const API = "https://taskmanager-production-a175.up.railway.app";

export default function Calendar({ token }) {
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/api/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
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
      fetchTasks();
      fetchAppointments();
    }
  }, [token]);

  // FILTER BY DATE
  const filteredTasks = tasks.filter((t) =>
    selectedDate
      ? t.due_date?.slice(0, 10) === selectedDate
      : true
  );

  const filteredAppointments = appointments.filter((a) =>
    selectedDate
      ? a.appointment_date?.slice(0, 10) === selectedDate
      : true
  );

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "20px auto",
        padding: "10px",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
          color: "#1e293b",
          fontSize: "clamp(24px, 5vw, 34px)",
        }}
      >
        📅 Smart Calendar
      </h1>

      {/* DATE FILTER */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={styles.input}
      />

      {/* SUMMARY BOXES */}
      <div style={styles.summary}>
        <Box label="Tasks" value={filteredTasks.length} />
        <Box label="Appointments" value={filteredAppointments.length} />
      </div>

      {/* GRID */}
      <div style={styles.grid}>
        {/* TASKS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📝 Tasks</h2>

          {filteredTasks.length === 0 ? (
            <p style={styles.empty}>No tasks</p>
          ) : (
            filteredTasks.map((t) => (
              <div key={t.id} style={styles.item}>
                <strong>{t.title}</strong>

                <p style={styles.text}>
                  👤 {t.patient_name}
                </p>

                <p style={styles.text}>
                  📌 {t.status}
                </p>
              </div>
            ))
          )}
        </div>

        {/* APPOINTMENTS */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📌 Appointments</h2>

          {filteredAppointments.length === 0 ? (
            <p style={styles.empty}>No appointments</p>
          ) : (
            filteredAppointments.map((a) => (
              <div key={a.id} style={styles.item}>
                <strong>{a.title}</strong>

                <p style={styles.text}>
                  👤 {a.patient_name}
                </p>

                <p style={styles.text}>
                  📅 {a.appointment_date}
                </p>

                <p style={styles.text}>
                  ⏰ {a.appointment_time}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// SMALL SUMMARY BOX
function Box({ label, value }) {
  return (
    <div style={styles.box}>
      <h3 style={{ marginBottom: "10px" }}>{label}</h3>

      <h2
        style={{
          color: "#2563eb",
          fontSize: "32px",
          margin: 0,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    marginBottom: "20px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  summary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "25px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    marginBottom: "18px",
    color: "#1e293b",
  },

  item: {
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 0",
  },

  text: {
    margin: "4px 0",
    color: "#475569",
  },

  empty: {
    color: "#64748b",
  },

  box: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
};