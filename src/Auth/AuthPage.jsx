import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login";
import Register from "./Register";
import "./AuthPage.css";

function AuthPage({ setUser }) {
  const [mode, setMode] = useState("login"); // login | register

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.div
              key="login"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Login
                setUser={setUser}
                setPage={() => setMode("register")}
              />
            </motion.div>
          )}

          {mode === "register" && (
            <motion.div
              key="register"
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <Register setPage={() => setMode("login")} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AuthPage;
