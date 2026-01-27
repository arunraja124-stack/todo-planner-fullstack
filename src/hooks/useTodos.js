import { useEffect, useState } from "react";

export default function useTodos() {
  const [tasks, setTasks] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(task) {
    setTasks([...tasks, task]);
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

  function updateTaskText(index, text) {
    setTasks(tasks.map((t, i) =>
      i === index ? { ...t, text } : t
    ));
  }

  return {
    tasks,
    today,
    addTask,
    toggleComplete,
    deleteTask,
    togglePin,
    updateTaskText,
    setTasks
  };
}
