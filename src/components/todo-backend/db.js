const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔌 MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shansi12",
  database: "todo_app",
});

db.connect((err) => {
  if (err) {
    console.log("DB error", err);
  } else {
    console.log("MySQL connected");
  }
});

// 🧪 Test API
app.get("/", (req, res) => {
  res.send("Backend running");
});

// 🔐 REGISTER (DB write starts here)
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const sql =
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

  db.query(sql, [name, email, password], (err) => {
    if (err) {
      res.status(400).json(err);
    } else {
      res.json({ message: "User registered" });
    }
  });
});

// 🔑 LOGIN (DB read)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email=? AND password=?";

  db.query(sql, [email, password], (err, result) => {
    if (result.length > 0) {
      res.json(result[0]);
    } else {
      res.status(401).json({ message: "Invalid login" });
    }
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
