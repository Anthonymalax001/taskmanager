import { useEffect, useState } from "react";
import API_URL from "./api";

export default function Patients({ token }) {
  const [patients, setPatients] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState("");

  // FETCH PATIENTS
  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_URL}/api/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error(err);
      setPatients([]);
    }
  };

  useEffect(() => {
    if (token) fetchPatients();
  }, [token]);

  // PHONE INPUT
  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");

    // LIMIT TO 10 DIGITS
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  // ADD PATIENT
  const addPatient = async () => {
    if (!name || !phone) {
      alert("Name and phone required");
      return;
    }

    // VALIDATE PHONE
    if (phone.length !== 10) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    try {
      await fetch(`${API_URL}/api/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          phone,
          age,
          gender,
          notes,
          medical_history: history,
        }),
      });

      setName("");
      setPhone("");
      setAge("");
      setGender("");
      setNotes("");
      setHistory("");

      fetchPatients();

    } catch (err) {
      console.error(err);
      alert("Failed to add patient");
    }
  };

  return (
    <div style={styles.container}>

      {/* ADD PATIENT */}
      <div style={styles.card}>
        <h2 style={styles.heading}>Add Patient</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          type="tel"
          placeholder="Phone Number (10 digits)"
          value={phone}
          onChange={handlePhoneChange}
          style={styles.input}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={styles.input}
        />

        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={styles.textarea}
        />

        <textarea
          placeholder="Medical History"
          value={history}
          onChange={(e) => setHistory(e.target.value)}
          style={styles.textarea}
        />

        <button onClick={addPatient} style={styles.button}>
          Add Patient
        </button>
      </div>

      {/* PATIENTS */}
      <h2 style={styles.sectionTitle}>Patients</h2>

      {patients.length === 0 ? (
        <p style={styles.empty}>No patients yet</p>
      ) : (
        patients.map((p) => (
          <div key={p.id} style={styles.patientCard}>
            <h3 style={styles.patientName}>{p.name}</h3>

            <p style={styles.info}>📞 {p.phone}</p>
            <p style={styles.info}>Age: {p.age || "-"}</p>
            <p style={styles.info}>Gender: {p.gender || "-"}</p>

            {p.notes && (
              <p style={styles.info}>
                <strong>Notes:</strong> {p.notes}
              </p>
            )}

            {p.medical_history && (
              <p style={styles.info}>
                <strong>History:</strong> {p.medical_history}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "20px auto",
    padding: "15px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "14px",
    marginBottom: "30px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "24px",
    color: "#1e293b",
  },

  input: {
    width: "100%",
    padding: "13px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  textarea: {
    width: "100%",
    padding: "13px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    minHeight: "90px",
    resize: "vertical",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },

  sectionTitle: {
    marginBottom: "15px",
    fontSize: "24px",
    color: "#1e293b",
  },

  patientCard: {
    background: "#fff",
    padding: "18px",
    borderRadius: "12px",
    marginBottom: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    wordBreak: "break-word",
  },

  patientName: {
    marginBottom: "10px",
    fontSize: "20px",
    color: "#111827",
  },

  info: {
    margin: "6px 0",
    fontSize: "15px",
    color: "#374151",
  },

  empty: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: "20px",
  },
};