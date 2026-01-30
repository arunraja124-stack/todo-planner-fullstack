const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db"); // ✅ DB connection file

const app = express();

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🧪 Health check
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
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

// 🚀 START SERVER (ONLY ONCE – Render safe)
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
