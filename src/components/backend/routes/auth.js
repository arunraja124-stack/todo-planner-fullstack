import { useState } from "react";

function Auth() {
  const [mode, setMode] = useState("login"); // login | register

  return (
    <div className="app auth-card">
      <h1>{mode === "login" ? "Welcome Back" : "Create Account"}</h1>

      <div className="auth-switch">
        <button
          className={mode === "login" ? "active" : ""}
          onClick={() => setMode("login")}
        >
          Login
        </button>
        <button
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          Register
        </button>
      </div>

      <div className="input-box column">
        {mode === "register" && (
          <input type="text" placeholder="Full Name" />
        )}

        <input type="email" placeholder="Email address" />
        <input type="password" placeholder="Password" />

        {mode === "register" && (
          <input type="password" placeholder="Confirm Password" />
        )}

        <button className="primary-btn">
          {mode === "login" ? "Login" : "Register"}
        </button>
      </div>

      <p className="muted">
        {mode === "login"
          ? "New here? Switch to Register"
          : "Already have an account? Switch to Login"}
      </p>
    </div>
  );
}

export default Auth;
