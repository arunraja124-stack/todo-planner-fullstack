import fs from "fs";
import path from "path";
import mysql from "mysql2";

// load CA cert
const caCert = fs.readFileSync(
  path.resolve("src/components/backend/ca.pem")
);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: caCert
  }
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("✅ MySQL connected");
});
