const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Log connection (but don't crash app)
pool
  .connect()
  .then((client) => {
    console.log("Connected to Neon DB ✅");
    client.release();
  })
  .catch((err) => console.error("Connection error ❌", err));

// ✅ Prevent crashes from unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected DB error", err);
});

module.exports = pool;