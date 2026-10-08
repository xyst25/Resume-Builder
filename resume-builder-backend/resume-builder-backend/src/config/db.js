const { Pool } = require("pg");
require("dotenv").config();

if (!process.env.DATABASE_URL) {
  console.warn(
    "[db] DATABASE_URL is not set. Copy .env.example to .env and fill it in."
  );
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("[db] Unexpected error on idle client", err);
});

// Small helper so controllers can just do `await db.query(sql, params)`
const query = (text, params) => pool.query(text, params);

module.exports = { pool, query };
