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
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>Create Account</h2>

        <p style={styles.subtitle}>
          Start managing your clinic
        </p>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        {/* PASSWORD */}
        <div style={styles.passwordContainer}>
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
        <button
          onClick={handleRegister}
          style={styles.button}
        >
          Register
        </button>

        {/* FOOTER */}
        <p style={styles.footer}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={switchToLogin}
          >
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
    width: "100%",
    maxWidth: "400px",
    background: "#fff",
    padding: "35px 25px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    fontSize: "34px",
    marginBottom: "10px",
    color: "#111827",
  },

  subtitle: {
    textAlign: "center",
    color: "#6b7280",
    marginBottom: "28px",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  passwordContainer: {
    position: "relative",
    width: "100%",
    marginBottom: "18px",
  },

  passwordInput: {
    width: "100%",
    padding: "14px 70px 14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  toggle: {
    position: "absolute",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#16a34a",
    fontWeight: "600",
    fontSize: "14px",
    userSelect: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  footer: {
    marginTop: "22px",
    textAlign: "center",
    color: "#6b7280",
    fontSize: "14px",
  },

  link: {
    color: "#16a34a",
    cursor: "pointer",
    fontWeight: "bold",
  },
};