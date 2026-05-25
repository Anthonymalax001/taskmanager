import { useState } from "react";
import Dashboard from "./Dashboard";
import Patients from "./Patients";
import Tasks from "./Tasks";
import Calendar from "./Calendar";
import Appointments from "./Appointments";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [isRegistering, setIsRegistering] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // 🔒 NOT LOGGED IN
  if (!token) {
    return isRegistering ? (
      <Register
        setToken={setToken}
        switchToLogin={() => setIsRegistering(false)}
      />
    ) : (
      <Login
        setToken={setToken}
        switchToRegister={() => setIsRegistering(true)}
      />
    );
  }

  // 🔓 LOGGED IN
  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard token={token} />;
      case "patients":
        return <Patients token={token} />;
      case "tasks":
        return <Tasks token={token} />;
      case "calendar":
        return <Calendar token={token} />;
      case "appointments":
        return <Appointments token={token} />;
      default:
        return <Dashboard token={token} />;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f1f5f9",
        padding: "15px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(22px, 5vw, 32px)",
            color: "#1e293b",
          }}
        >
          🏥 Clinic Task Manager
        </h1>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setToken(null);
          }}
          style={{
            padding: "10px 14px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        <Tab
          label="Dashboard"
          onClick={() => setActiveTab("dashboard")}
          active={activeTab === "dashboard"}
        />

        <Tab
          label="Patients"
          onClick={() => setActiveTab("patients")}
          active={activeTab === "patients"}
        />

        <Tab
          label="Tasks"
          onClick={() => setActiveTab("tasks")}
          active={activeTab === "tasks"}
        />

        <Tab
          label="Calendar"
          onClick={() => setActiveTab("calendar")}
          active={activeTab === "calendar"}
        />

        <Tab
          label="Appointments"
          onClick={() => setActiveTab("appointments")}
          active={activeTab === "appointments"}
        />
      </div>

      {/* ACTIVE PAGE */}
      <div>{renderTab()}</div>
    </div>
  );
}

// TAB COMPONENT
function Tab({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 18px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: active ? "#2563eb" : "#0f172a",
        color: "#fff",
        fontWeight: "bold",
        whiteSpace: "nowrap",
        minWidth: "120px",
        transition: "0.2s",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}