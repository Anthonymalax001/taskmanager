import { useEffect, useState } from "react";
import API_URL from "./api";

export default function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setError("Unauthorized. Please login again.");
          return;
        }

        const result = await res.json();

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

  // LOADING
  if (!data && !error) {
    return (
      <div style={styles.center}>
        <div style={styles.loadingCard}>
          <h2>Loading Dashboard...</h2>
        </div>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.errorCard}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const { stats, urgent = [], overdue = [], today = [] } = data;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📊 Dashboard</h1>

      {/* STATS */}
      <div style={styles.grid}>
        <Card title="Patients" value={stats.totalPatients || 0} />
        <Card title="Total Tasks" value={stats.totalTasks || 0} />
        <Card title="Completed" value={stats.completedTasks || 0} />
        <Card title="Missed" value={stats.missedTasks || 0} />
        <Card
          title="Completion"
          value={`${stats.completionRate || 0}%`}
        />
      </div>

      {/* TASKS */}
      <Section title=" Urgent Tasks" items={urgent} />
      <Section title=" Missed Tasks" items={overdue} />
      <Section title=" Today's Tasks" items={today} />
    </div>
  );
}

// CARD COMPONENT
function Card({ title, value }) {
  return (
    <div style={styles.card}>
      <p style={styles.cardTitle}>{title}</p>

      <h2 style={styles.cardValue}>{value}</h2>
    </div>
  );
}

// SECTION COMPONENT
function Section({ title, items = [] }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>

      {items.length === 0 ? (
        <div style={styles.emptyCard}>
          <p>No tasks available</p>
        </div>
      ) : (
        items.map((t) => (
          <div key={t.id} style={styles.taskItem}>
            <strong>{t.title}</strong>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "15px",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },

  title: {
    fontSize: "clamp(28px, 5vw, 40px)",
    marginBottom: "25px",
    color: "#1e293b",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  },

  card: {
    background: "#ffffff",
    padding: "22px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  cardTitle: {
    color: "#64748b",
    fontSize: "15px",
    marginBottom: "10px",
  },

  cardValue: {
    color: "#2563eb",
    fontSize: "34px",
    margin: 0,
  },

  section: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  sectionTitle: {
    marginBottom: "16px",
    color: "#1e293b",
    fontSize: "20px",
  },

  taskItem: {
    padding: "14px",
    borderBottom: "1px solid #e5e7eb",
    color: "#334155",
    fontSize: "15px",
    wordBreak: "break-word",
  },

  emptyCard: {
    padding: "14px",
    borderRadius: "10px",
    background: "#f8fafc",
    color: "#64748b",
    textAlign: "center",
  },

  loadingCard: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  errorCard: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "20px",
    borderRadius: "14px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
  },
};