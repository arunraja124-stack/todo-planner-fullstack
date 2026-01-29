import express from "express";
import cors from "cors";
import dotenv from "dotenv";
console.log("DB_HOST =", process.env.DB_HOST);
import mysql from "mysql2";

dotenv.config();

const app = express();
const PORT = 5000;

// ✅ FIXED CORS
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shansi12",
  database: "todo_app"
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

/* =========================
   ADD ROUTES BELOW THIS
========================= */

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
