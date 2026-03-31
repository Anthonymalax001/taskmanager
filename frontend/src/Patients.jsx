import { useEffect, useState } from "react";

export default function Patients({ token }) {
  const [patients, setPatients] = useState([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState("");

  // Fetch patients
  const fetchPatients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/patients", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPatients(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchPatients();
  }, [token]);

  // Add patient
  const addPatient = async () => {
    if (!name || !phone) {
      alert("Name and phone required");
      return;
    }

    await fetch("http://localhost:5000/api/patients", {
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

    // reset
    setName("");
    setPhone("");
    setAge("");
    setGender("");
    setNotes("");
    setHistory("");

    fetchPatients();
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto" }}>
      
      {/* ADD PATIENT */}
      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "30px"
      }}>
        <h2>Add Patient</h2>

        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <br />

        <input placeholder="Phone (+254...)" value={phone} onChange={e => setPhone(e.target.value)} />
        <br />

        <input placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
        <br />

        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <br />

        <textarea
          placeholder="Notes (symptoms, quick notes)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <br />

        <textarea
          placeholder="Medical History"
          value={history}
          onChange={e => setHistory(e.target.value)}
        />
        <br />

        <button onClick={addPatient}>Add Patient</button>
      </div>

      {/* PATIENT LIST */}
      <div>
        <h2>Patients</h2>

        {patients.length === 0 ? (
          <p>No patients yet</p>
        ) : (
          patients.map((p) => (
            <div key={p.id} style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "#fff"
            }}>
              <h3>{p.name}</h3>
              <p>📞 {p.phone}</p>
              <p>Age: {p.age || "-"}</p>
              <p>Gender: {p.gender || "-"}</p>

              {p.notes && <p><strong>Notes:</strong> {p.notes}</p>}
              {p.medical_history && <p><strong>History:</strong> {p.medical_history}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}