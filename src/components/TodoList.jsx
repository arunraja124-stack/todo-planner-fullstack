import TodoItem from "./TodoItem";

function TodoList({ tasks, toggleComplete, deleteTask, togglePin }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        ✨ No tasks yet <br />
        <span>Add your first task to get started</span>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task, index) => (
        <TodoItem
          key={task.id ?? index}   // ✅ SAFE fallback
          task={task}
          index={index}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          togglePin={togglePin}
        />
      ))}
    </ul>
  );
}

export default TodoList;
