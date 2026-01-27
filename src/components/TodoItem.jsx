import { motion } from "framer-motion";
function TodoItem({ task, index, toggleComplete, deleteTask, togglePin }) {
  return (
    <li className={`task-item priority-${task.priority}`}>
      <div className="task-left">
        <motion.input
  type="checkbox"
  checked={task.completed}
  onChange={() => toggleComplete(index)}
  whileTap={{ scale: 1.2 }}
/>


        <span className={task.completed ? "done" : ""}>
          {task.text}
          <small className="meta">
            {task.priority} · {task.category}
          </small>
        </span>
      </div>

      <div className="task-actions">
        <button onClick={() => togglePin(index)}>
          {task.pinned ? "📌" : "📍"}
        </button>
        <button onClick={() => deleteTask(index)}>❌</button>
      </div>
    </li>
  );
}

export default TodoItem;
