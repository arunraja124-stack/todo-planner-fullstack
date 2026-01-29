import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; 

dotenv.config();

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load CA certificate (same folder as server.js)
const caCert = fs.readFileSync(
  path.join(__dirname, "ca.pem")
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
