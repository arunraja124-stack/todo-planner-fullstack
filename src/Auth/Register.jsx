import { useState } from "react";
import "./Auth.css";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      alert("Account created successfully!");
      setPage("login");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <form className="auth-card" onSubmit={handleRegister}>
      <h2>Create Account</h2>
      <p className="sub">Start your journey</p>

      <div className="input-group">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          placeholder="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </div>

      <button className="primary-btn">Create Account</button>

      <p className="bottom-text">
        Already have an account?
        <span onClick={() => setPage("login")}> Sign in</span>
      </p>
    </form>
  );
}

export default Register;
