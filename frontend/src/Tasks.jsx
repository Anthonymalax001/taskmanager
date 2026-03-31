import { useEffect, useState } from "react";
import API_URL from "./api";

export default function Tasks({ token }) {
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [patientId, setPatientId] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const fetchPatients = async () => {
    const res = await fetch(`${API_URL}/api/patients`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPatients(data);
  };

  const fetchTasks = async () => {
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (token) {
      fetchPatients();
      fetchTasks();
    }
  }, [token]);

  const createTask = async () => {
    if (!title || !patientId || !dueDate) {
      alert("Fill all fields");
      return;
    }

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
  };

  const completeTask = async (id) => {
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchTasks();
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto" }}>
      <h2>Create Task</h2>

      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <br />

      <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
        <option value="">Select patient</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <br />

      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <br />

      <button onClick={createTask}>Create Task</button>

      <h2>Tasks</h2>

      {tasks.map((t) => (
        <div key={t.id}>
          <p>{t.title}</p>
          <button onClick={() => completeTask(t.id)}>Done</button>
        </div>
      ))}
    </div>
  );
}