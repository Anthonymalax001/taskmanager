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
      alert("Server error (backend may be waking up )");
    }
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.logo}>🏥</h1>

        <h2 style={styles.title}>Welcome Back </h2>

        <p style={styles.subtitle}>
          Login to your clinic dashboard
        </p>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <div style={styles.passwordWrapper}>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.passwordInput}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.toggle}
          >
            {showPassword ? "Hide" : "Show"}
          </span>

        </div>

        {/* BUTTON */}
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        {/* FOOTER */}
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
    padding: "35px 24px",
    borderRadius: "20px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
    boxSizing: "border-box",
  },

  logo: {
    textAlign: "center",
    fontSize: "52px",
    marginBottom: "10px",
  },

  title: {
    textAlign: "center",
    marginBottom: "6px",
    color: "#0f172a",
    fontSize: "30px",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "24px",
    color: "#64748b",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "18px",
  },

  passwordInput: {
    width: "100%",
    padding: "14px",
    paddingRight: "75px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  toggle: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#2563eb",
    cursor: "pointer",
    userSelect: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  footer: {
    marginTop: "20px",
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