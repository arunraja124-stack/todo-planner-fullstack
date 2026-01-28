import { useState } from "react";
import "./Login.css";

function Login({ setUser, setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid credentials");
        return;
      }

      // ✅ LOGIN SUCCESS (🔥 FIX HERE)
    if (res.ok) {
     localStorage.setItem("currentUser", data.user.email);
     localStorage.setItem("userId", data.user.id); // 🔥 MUST
     setUser(data.user.email);
}

 
    } catch (err) {
      setError("Server not reachable");
    }
  }

  return (
    <form className="Auth-card" onSubmit={handleLogin}>
      <h2>Log in</h2>
      <p className="sub">Welcome back</p>

      {error && <p className="error">{error}</p>}

      <div className="input-group">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className="primary-btn">Login</button>

      <p className="bottom-text">
        Don’t have an account?
        <span onClick={() => setPage("register")}> Sign up</span>
      </p>
    </form>
  );
}

export default Login;
