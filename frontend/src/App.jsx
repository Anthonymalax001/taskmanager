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
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Clinic Task Manager</h1>

      {/* LOGOUT BUTTON */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null);
        }}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          padding: "8px 12px",
          background: "#ef4444",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>

      {/* TABS */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <Tab label="Dashboard" onClick={() => setActiveTab("dashboard")} active={activeTab === "dashboard"} />
        <Tab label="Patients" onClick={() => setActiveTab("patients")} active={activeTab === "patients"} />
        <Tab label="Tasks" onClick={() => setActiveTab("tasks")} active={activeTab === "tasks"} />
        <Tab label="Calendar" onClick={() => setActiveTab("calendar")} active={activeTab === "calendar"} />
        <Tab label="Appointments" onClick={() => setActiveTab("appointments")} active={activeTab === "appointments"} />
      </div>

      {renderTab()}
    </div>
  );
}

// TAB COMPONENT
function Tab({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
        background: active ? "#2563eb" : "#000",
        color: "#fff",
        fontWeight: "bold",
      }}
    >
      {label}
    </button>
  );
}