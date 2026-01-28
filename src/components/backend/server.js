import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.listen(5000, () =>
  console.log("Server running on port 5000 🚀")
);
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
