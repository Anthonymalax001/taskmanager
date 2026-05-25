import { useState } from "react";
import API_URL from "./api";

export default function Login({ setToken, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error (backend may be waking up ⏳)");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>🏥</h1>

        <h2 style={styles.title}>Welcome Back</h2>

        <p style={styles.subtitle}>
          Login to your clinic dashboard
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.showButton}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        {/* REGISTER LINK */}
        <p style={styles.footer}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={switchToRegister}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background:
      "linear-gradient(135deg, #2563eb, #1d4ed8, #1e3a8a)",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    background: "#ffffff",
    padding: "35px 25px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },

  logo: {
    textAlign: "center",
    fontSize: "48px",
    marginBottom: "10px",
  },

  title: {
    textAlign: "center",
    marginBottom: "8px",
    color: "#0f172a",
    fontSize: "28px",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#64748b",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  passwordWrapper: {
    position: "relative",
    marginBottom: "18px",
  },

  passwordInput: {
    width: "100%",
    padding: "14px",
    paddingRight: "80px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  showButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px",
  },

  footer: {
    marginTop: "22px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    cursor: "pointer",
    fontWeight: "bold",
  },
};