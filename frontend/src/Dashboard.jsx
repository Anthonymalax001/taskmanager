import { useEffect, useState } from "react";

export default function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 🔥 HANDLE UNAUTHORIZED
        if (res.status === 401) {
          setError("Unauthorized. Please login again.");
          return;
        }

        const result = await res.json();

        // 🔥 SAFETY CHECK
        if (!result || !result.stats) {
          setError("No dashboard data available");
          return;
        }

        setData(result);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      }
    };

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  // 🔥 LOADING
  if (!data && !error) return <p>Loading dashboard...</p>;

  // 🔥 ERROR
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const { stats, urgent = [], overdue = [], today = [] } = data;

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
      <h1>📊 Dashboard</h1>

      {/* 🔥 ANALYTICS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <Card title="Patients" value={stats.totalPatients || 0} />
        <Card title="Total Tasks" value={stats.totalTasks || 0} />
        <Card title="Completed" value={stats.completedTasks || 0} />
        <Card title="Missed" value={stats.missedTasks || 0} />
        <Card title="Completion %" value={`${stats.completionRate || 0}%`} />
      </div>

      {/* 🔥 TASK SECTIONS */}
      <Section title="🔥 Urgent Tasks" items={urgent} />
      <Section title="⚠️ Missed Tasks" items={overdue} />
      <Section title="📅 Today" items={today} />
    </div>
  );
}

// 🔹 CARD COMPONENT
function Card({ title, value }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        textAlign: "center",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
}

// 🔹 SECTION COMPONENT
function Section({ title, items = [] }) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <h2>{title}</h2>

      {items.length === 0 ? (
        <p>None</p>
      ) : (
        items.map((t) => <p key={t.id}>{t.title}</p>)
      )}
    </div>
  );
}