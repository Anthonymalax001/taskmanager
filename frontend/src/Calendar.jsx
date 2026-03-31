import { useEffect, useState } from "react";

export default function Calendar({ token }) {
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    const res = await fetch("http://localhost:5000/api/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchAppointments();
    }
  }, [token]);

  // 🔥 FILTER BY DATE
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

      {/* DATE SELECTOR */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "100%",
        }}
      />

      {/* SUMMARY */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginBottom: "20px"
      }}>
        <Box label="Tasks" value={filteredTasks.length} />
        <Box label="Appointments" value={filteredAppointments.length} />
      </div>

      {/* GRID VIEW */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "20px"
      }}>
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
                <p>{new Date(a.appointment_date).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 small components
const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const item = {
  borderBottom: "1px solid #eee",
  padding: "10px 0",
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