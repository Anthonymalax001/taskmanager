import { useEffect, useState } from "react";
import API_URL from "./api";

export default function Tasks({ token }) {
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

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

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
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

  useEffect(() => {
    if (token) {
      fetchPatients();
      fetchTasks();
    }
  }, [token]);

  // CREATE TASK
  const createTask = async () => {
    if (!title || !patientId || !dueDate) {
      alert("Fill all fields");
      return;
    }

    try {
      await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          patient_id: patientId,
          priority,
          due_date: dueDate,
        }),
      });

      setTitle("");
      setPatientId("");
      setPriority("medium");
      setDueDate("");

      fetchTasks();

    } catch (err) {
      console.error(err);
      alert("Failed to create task");
    }
  };

  // COMPLETE TASK
  const completeTask = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchTasks();

    } catch (err) {
      console.error(err);
      alert("Failed to update task");
    }
  };

  return (
    <div style={styles.container}>
      
      {/* CREATE TASK */}
      <div style={styles.card}>
        <h2 style={styles.heading}> Create Task</h2>

        <input
          type="text"
          placeholder="Task title"
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

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.input}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={styles.input}
        />

        <button onClick={createTask} style={styles.button}>
          Create Task
        </button>
      </div>

      {/* TASKS */}
      <div>
        <h2 style={styles.heading}> Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map((t) => (
            <div key={t.id} style={styles.taskCard}>
              <h3 style={{ marginBottom: "8px" }}>{t.title}</h3>

              <p>
                <strong>Patient:</strong> {t.patient_name || "Unknown"}
              </p>

              <p>
                <strong>Priority:</strong> {t.priority}
              </p>

              <p>
                <strong>Status:</strong> {t.status}
              </p>

              <p>
                <strong>Due:</strong>{" "}
                {t.due_date
                  ? new Date(t.due_date).toLocaleDateString()
                  : "-"}
              </p>

              {t.status !== "completed" && (
                <button
                  onClick={() => completeTask(t.id)}
                  style={styles.doneButton}
                >
                   Mark Complete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// STYLES
const styles = {
  container: {
    maxWidth: "900px",
    margin: "20px auto",
    padding: "15px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  heading: {
    marginBottom: "15px",
    fontSize: "22px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  taskCard: {
    background: "#fff",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    wordBreak: "break-word",
  },

  doneButton: {
    marginTop: "12px",
    padding: "10px 14px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};