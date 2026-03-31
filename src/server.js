require("dotenv").config();
require("./db");

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/patients", require("./routes/patients"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/notes", require("./routes/notes"));

// GLOBAL ERROR HANDLER (🔥 important)
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});