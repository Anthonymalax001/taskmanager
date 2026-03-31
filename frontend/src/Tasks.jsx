import { useEffect, useState } from "react";

export default function Tasks({ token }) {
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // 🔥 FIXED: Auto refresh patients
  useEffect(() => {
    if (token) {
      fetchPatients();
      fetchTasks();

      const interval = setInterval(() => {
        fetchPatients(); // keeps dropdown updated
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [token]);

  // Create task
  const createTask = async () => {
    if (!title || !patientId || !dueDate) {
      alert("Fill all fields");
      return;
    }

    await fetch("http://localhost:5000/api/tasks", {
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
  };

  // Mark complete
  const completeTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      
      {/* CREATE TASK */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <h2>Create Task</h2>

        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          onClick={fetchPatients} // 🔥 refresh when opened
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="">Select patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">🔥 High Priority</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "15px" }}
        />

        <button
          onClick={createTask}
          style={{
            width: "100%",
            padding: "12px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Create Task
        </button>
      </div>

      {/* TASK LIST */}
      <div>
        <h2>All Tasks</h2>

        {tasks.length === 0 ? (
          <p>No tasks yet</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              style={{
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "15px",
                background:
                  task.title.includes("Follow-up")
                    ? "#e0f2fe"
                    : task.priority === "high" && task.status !== "completed"
                    ? "#ffe5e5"
                    : "#ffffff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
              }}
            >
              <h3>
                {task.title.includes("Follow-up") && "🔁 "}
                {task.title}
              </h3>

              <p><strong>Patient:</strong> {task.patient_name}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Status:</strong> {task.status}</p>

              {task.status !== "completed" && (
                <button
                  onClick={() => completeTask(task.id)}
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                >
                  ✔ Mark Complete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}