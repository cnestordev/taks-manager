// App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import PriorityColumn from "./components/PriorityColumn";

function App() {
  const items = JSON.parse(localStorage.getItem('tasks')) || [];
  const [tasks, setTasks] = useState(items);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");

  function addTask(e) {
    e.preventDefault();
    console.log(title, description, priority);
    setTasks([...tasks, { title, description, priority, id: generateId() }]);
  }

  function generateId() {
    return Math.random().toString(36).substring(2, 7);
  }  

  const deleteTask = task => {
    const taskId = task.id;
    const newTasks = [...tasks]
    const filteredTasks = newTasks.filter(task => task.id !== taskId)
    setTasks(filteredTasks)
  }

  const highPriorityTasks = tasks.filter((task) => task.priority === "High");
  const mediumPriorityTasks = tasks.filter(
    (task) => task.priority === "Medium"
  );
  const lowPriorityTasks = tasks.filter((task) => task.priority === "Low");

  useEffect(() => {
    console.log("%c change detected", "color: red")
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks]);

  return (
    <div className="container">
      <div className="columns-container">
        <PriorityColumn deleteTask={deleteTask} priority="High" tasks={highPriorityTasks} />
        <PriorityColumn deleteTask={deleteTask} priority="Medium" tasks={mediumPriorityTasks} />
        <PriorityColumn deleteTask={deleteTask} priority="Low" tasks={lowPriorityTasks} />
      </div>
      <div className="form-container">
        <h1>Add Task</h1>
        <form onSubmit={(e) => addTask(e)}>
          <div className="input-field">
            <label htmlFor="title">Title:</label>
            <input onChange={(e) => setTitle(e.target.value)} type="text" id="title" />
          </div>
          <div className="input-field">
            <label htmlFor="description">Description:</label>
            <textarea onChange={(e) => setDescription(e.target.value)} id="description" />
          </div>
          <div className="input-field">
            <label htmlFor="priority">Priority:</label>
            <select onChange={(e) => setPriority(e.target.value)} id="priority">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
