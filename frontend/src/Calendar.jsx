import { useEffect, useState } from "react";

const API = "https://taskmanager-u3hl.onrender.com";

export default function Calendar({ token }) {
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API}/api/appointments`, {
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
      fetchTasks();
      fetchAppointments();
    }
  }, [token]);

  // Filter
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
    <div style={{ maxWidth: "1000px", margin: "30px auto" }}>
      <h1>📅 Smart Calendar</h1>

      {/* DATE */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={input}
      />

      {/* SUMMARY */}
      <div style={summary}>
        <Box label="Tasks" value={filteredTasks.length} />
        <Box label="Appointments" value={filteredAppointments.length} />
      </div>

      {/* GRID */}
      <div style={grid}>
        
        {/* TASKS */}
        <div style={card}>
          <h2>📝 Tasks</h2>
          {filteredTasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            filteredTasks.map((t) => (
              <div key={t.id} style={item}>
                <strong>{t.title}</strong>
                <p>{t.patient_name}</p>
                <p>{t.status}</p>
              </div>
            ))
          )}
        </div>

        {/* APPOINTMENTS */}
        <div style={card}>
          <h2>📌 Appointments</h2>
          {filteredAppointments.length === 0 ? (
            <p>No appointments</p>
          ) : (
            filteredAppointments.map((a) => (
              <div key={a.id} style={item}>
                <strong>{a.title}</strong>
                <p>{a.patient_name}</p>
                <p>{a.appointment_date} {a.appointment_time}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// styles
const input = {
  padding: "10px",
  marginBottom: "20px",
  width: "100%"
};

const summary = {
  display: "flex",
  gap: "20px",
  marginBottom: "20px"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px"
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
};

const item = {
  borderBottom: "1px solid #eee",
  padding: "10px 0"
};

function Box({ label, value }) {
  return (
    <div style={{
      flex: 1,
      background: "#fff",
      padding: "15px",
      borderRadius: "10px",
      textAlign: "center"
    }}>
      <h3>{label}</h3>
      <h2>{value}</h2>
    </div>
  );
}