import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql2";

dotenv.config();

// 🔍 DEBUG (keep for now)
console.log("DB_HOST =", process.env.DB_HOST);

if (!process.env.DB_HOST) {
  console.error("❌ DB_HOST NOT FOUND. ENV VARS NOT LOADED.");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ FIXED CORS (allow frontend)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ✅ FIXED DB CONNECTION (NO localhost)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }
  console.log("✅ MySQL connected");
});

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      if (results.length === 0)
        return res.status(401).json({ message: "Invalid credentials" });

      res.json({ user: results[0] });
    }
  );
});

// GET TASKS
app.get("/tasks/:userId", (req, res) => {
  const { userId } = req.params;

  db.query(
    "SELECT * FROM tasks WHERE user_id = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "DB error" });
      res.json(results);
    }
  );
});

// ADD TASK
app.post("/tasks", (req, res) => {
  const { userId, text, dueDate, priority, category } = req.body;

  db.query(
    "INSERT INTO tasks (user_id, text, due_date, priority, category) VALUES (?, ?, ?, ?, ?)",
    [userId, text, dueDate, priority, category],
    (err) => {
      if (err) return res.status(500).json({ message: "Insert failed" });
      res.json({ message: "Task added" });
    }
  );
});

// start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
