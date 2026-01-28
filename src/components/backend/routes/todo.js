import express from "express";
import bcrypt from "bcryptjs";
import db from "../db.js";

const router = express.Router();

// REGISTER
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query(
    "INSERT INTO users (username, password) VALUES (?,?)",
    [username, hashed],
    err => {
      if (err) return res.status(400).json(err);
      res.json({ message: "User registered" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    (err, result) => {
      if (result.length === 0)
        return res.status(401).json("User not found");

      const user = result[0];
      const isValid = bcrypt.compareSync(password, user.password);

      if (!isValid)
        return res.status(401).json("Wrong password");

      res.json({
        id: user.id,
        username: user.username
      });
    }
  );
});

export default router;
