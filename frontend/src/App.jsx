import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const api = axios.create({ baseURL: "http://localhost:8001" });

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // Runs once when the page loads: fetch all tasks
  useEffect(() => {
    api.get("/tasks")
      .then((res) => setTasks(res.data))
      .catch(() => setError("Could not load tasks. Is the backend running?"));
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await api.post("/tasks", { title });
      setTasks([res.data, ...tasks]);   // add new task at the top
      setTitle("");
      setError("");
    } catch {
      setError("Could not add task.");
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await api.patch(`/tasks/${task.id}`, { completed: !task.completed });
      setTasks(tasks.map((t) => (t.id === task.id ? res.data : t)));
    } catch {
      setError("Could not update task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      setError("Could not delete task.");
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <form onSubmit={addTask} className="add-form">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          maxLength={200}
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? "done" : ""}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />
            <span>{task.title}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && <p className="empty">No tasks yet.</p>}
    </div>
  );
}
