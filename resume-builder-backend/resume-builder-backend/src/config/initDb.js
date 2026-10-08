// One-off script: node src/config/initDb.js
// Reads db/schema.sql and runs it against DATABASE_URL.
const fs = require("fs");
const path = require("path");
const { pool } = require("./db");

async function init() {
  const schemaPath = path.join(__dirname, "..", "..", "db", "schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf8");

  console.log("[init-db] Applying schema.sql ...");
  try {
    await pool.query(sql);
    console.log("[init-db] Done. Tables are ready.");
  } catch (err) {
    console.error("[init-db] Failed to apply schema:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

init();
