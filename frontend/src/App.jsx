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
  const [menuOpen, setMenuOpen] = useState(false);

  // NOT LOGGED IN
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

  // PAGES
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

  const changeTab = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div style={styles.app}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.logo}>
          🏥 Clinic Task Manager
        </h1>

        <div style={styles.headerRight}>
          
          {/* HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={styles.menuButton}
          >
            ☰
          </button>

          {/* LOGOUT */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setToken(null);
            }}
            style={styles.logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* MENU */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Tab
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => changeTab("dashboard")}
          />

          <Tab
            label="Patients"
            active={activeTab === "patients"}
            onClick={() => changeTab("patients")}
          />

          <Tab
            label="Tasks"
            active={activeTab === "tasks"}
            onClick={() => changeTab("tasks")}
          />

          <Tab
            label="Calendar"
            active={activeTab === "calendar"}
            onClick={() => changeTab("calendar")}
          />

          <Tab
            label="Appointments"
            active={activeTab === "appointments"}
            onClick={() => changeTab("appointments")}
          />
        </div>
      )}

      {/* DESKTOP NAV */}
      <div style={styles.desktopTabs}>
        <Tab
          label="Dashboard"
          active={activeTab === "dashboard"}
          onClick={() => changeTab("dashboard")}
        />

        <Tab
          label="Patients"
          active={activeTab === "patients"}
          onClick={() => changeTab("patients")}
        />

        <Tab
          label="Tasks"
          active={activeTab === "tasks"}
          onClick={() => changeTab("tasks")}
        />

        <Tab
          label="Calendar"
          active={activeTab === "calendar"}
          onClick={() => changeTab("calendar")}
        />

        <Tab
          label="Appointments"
          active={activeTab === "appointments"}
          onClick={() => changeTab("appointments")}
        />
      </div>

      {/* PAGE */}
      <div>
        {renderTab()}
      </div>
    </div>
  );
}

// TAB
function Tab({ label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "12px 18px",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
        background: active ? "#2563eb" : "#0f172a",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "15px",
        width: "100%",
      }}
    >
      {label}
    </button>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "15px",
    overflowX: "hidden",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },

  logo: {
    margin: 0,
    color: "#1e293b",
    fontSize: "clamp(24px, 5vw, 34px)",
  },

  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  menuButton: {
    background: "#0f172a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: "20px",
    cursor: "pointer",
  },

  logout: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },

  desktopTabs: {
    display: "none",
  },
};