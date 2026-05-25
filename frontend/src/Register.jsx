import { useState } from "react";
import API_URL from "./api";

export default function Register({ switchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          clinic_name: "My Clinic",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registered successfully! Please login.");
        switchToLogin();
      } else {
        alert(data.error || "Registration failed");
      }

    } catch (err) {
      console.error(err);
      alert("Server error (backend may be waking up )");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account </h2>
        <p style={styles.subtitle}>Start managing your clinic</p>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <div style={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
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

        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <span style={styles.link} onClick={switchToLogin}>
            Login
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
    background: "linear-gradient(135deg, #16a34a, #065f46)",
    padding: "20px",
  },

  card: {
    background: "#ffffff",
    padding: "30px 20px",
    borderRadius: "14px",
    width: "100%",
    maxWidth: "380px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
    boxSizing: "border-box",
  },

  title: {
    marginBottom: "5px",
    fontSize: "28px",
  },

  subtitle: {
    marginBottom: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  passwordWrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "15px",
  },

  passwordInput: {
    width: "100%",
    padding: "12px",
    paddingRight: "80px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  showButton: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#16a34a",
    cursor: "pointer",
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px",
  },

  footer: {
    marginTop: "15px",
    fontSize: "14px",
  },

  link: {
    color: "#16a34a",
    cursor: "pointer",
    fontWeight: "bold",
  },
};