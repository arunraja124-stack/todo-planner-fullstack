const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 Aiven MySQL connection (SSL REQUIRED)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false,
  },
});

// ✅ Connect DB
db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("MySQL connected");
});

// 🧪 Health check
app.get("/", (req, res) => {
  res.send("Backend running");
});

// 🔐 REGISTER
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err) => {
    if (err) {
      return res.status(400).json(err);
    }
    res.json({ message: "User registered" });
  });
});

// 🔑 LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(401).json({ message: "Invalid login" });
    }
  });
});

// 🚀 Render-safe PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
