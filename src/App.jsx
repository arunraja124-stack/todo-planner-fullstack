import { useEffect, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import AuthPage from "./Auth/AuthPage";
import { API_URL } from "./config";

function App() {
  // 🔐 AUTH STATE
  const [user, setUser] = useState(localStorage.getItem("currentUser"));
  const [page, setPage] = useState("login");

  // 📝 TODO STATES
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("work");
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const activeTasks = tasks.filter(t => !t.completed).length;
  const pinnedTasks = tasks.filter(t => t.pinned).length;

  // 🌗 THEME
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const today = new Date().toISOString().split("T")[0];

  // 🌗 APPLY THEME
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔔 NOTIFICATION PERMISSION
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // 📥 FETCH TASKS
  async function fetchTasks() {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const res = await fetch(`${API_URL}/tasks/${userId}`);
    const data = await res.json();
    setTasks(data);
  }

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // ➕ ADD TASK
  async function addTask() {
    if (!task || !dueDate) return;

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        text: task,
        dueDate,
        priority,
        category
      })
    });

    setTask("");
    setDueDate("");
    fetchTasks();
  }

  function toggleComplete(index) {
    setTasks(tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    ));
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function togglePin(index) {
    setTasks(tasks.map((t, i) =>
      i === index ? { ...t, pinned: !t.pinned } : t
    ));
  }

  const filteredTasks = tasks
    .filter(t => t.text.toLowerCase().includes(search.toLowerCase()))
    .filter(t =>
      filterCategory === "all" ? true : t.category === filterCategory
    )
    .sort((a, b) => b.pinned - a.pinned);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // 🔐 AUTH PAGE
  if (!user) {
    return (
      <AuthPage
        setUser={setUser}
        page={page}
        setPage={setPage}
      />
    );
  }

  // 🏠 MAIN UI
  return (
    <div className="app">
      <div className="top-bar">
        <h1 className="title">ToDo Planner</h1>

        <button
          className="theme-toggle"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <button
        className="theme-toggle"
        onClick={() => {
          localStorage.removeItem("currentUser");
          setUser(null);
          setPage("login");
        }}
      >
        Logout
      </button>

      <input
        className="search"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filterCategory}
        onChange={(e) => setFilterCategory(e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="work">Work</option>
        <option value="personal">Personal</option>
        <option value="health">Health</option>
        <option value="study">Study</option>
      </select>

      <div className="input-box">
        <input
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          min={today}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="health">Health</option>
          <option value="study">Study</option>
        </select>

        <button onClick={addTask}>Add</button>
      </div>

      <div className="progress-container">
        <div className="progress-text">
          Progress: {completedTasks}/{totalTasks} ({progress}%)
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="analytics">
        <div className="card"><span>Total</span><strong>{totalTasks}</strong></div>
        <div className="card"><span>Active</span><strong>{activeTasks}</strong></div>
        <div className="card"><span>Completed</span><strong>{completedTasks}</strong></div>
        <div className="card"><span>Pinned</span><strong>{pinnedTasks}</strong></div>
      </div>

      <TodoList
        tasks={filteredTasks}
        today={today}
        toggleComplete={toggleComplete}
        deleteTask={deleteTask}
        togglePin={togglePin}
      />
    </div>
  );
}

export default App;
