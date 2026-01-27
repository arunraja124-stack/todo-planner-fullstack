const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

console.log("Starting backend...");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Shansi12", // change
  database: "todo_app",
});

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL connection failed");
    console.log(err.message);
  } else {
    console.log("✅ MySQL connected");
  }
});

// ✅ TEST
app.get("/", (req, res) => {
  res.send("HELLO BACKEND WORKING");
});

/* ================= REGISTER ================= */
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  const check = "SELECT * FROM users WHERE email = ?";
  db.query(check, [email], (err, result) => {
    if (result.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const insert =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(insert, [name, email, password], (err) => {
      if (err) return res.status(500).json({ message: "DB error" });

      res.json({ message: "Account created successfully" });
    });
  });
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name,
      },
    });
  });
});

/* ================= LOGIN ================= */
// 🔐 LOGIN ROUTE
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN HIT:", email, password); // 🔥 DEBUG

  const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login success",
      user: {
        id: result[0].id,
        email: result[0].email,
        name: result[0].name
      }
    });
  });
});


app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
app.post("/tasks", (req, res) => {
  const { userId, text, dueDate, priority, category } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId missing" });
  }

  const sql = `
    INSERT INTO tasks (user_id, text, due_date, priority, category)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, text, dueDate, priority, category], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json({ message: "Task added" });
  });
});
app.get("/tasks/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT id, user_id, text, due_date, priority, category, completed, pinned
    FROM tasks
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB error" });
    }

    res.json(results);
  });
});
