import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool
  .connect()
  .then((client) => {
    console.log("✅ Connected to PostgreSQL!");

    client.release();
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

export default pool;

