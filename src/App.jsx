// App.jsx
import { useEffect, useState } from "react";
import "./App.css";
import PriorityColumn from "./components/PriorityColumn";
import FormContainer from "./components/FormContainer";

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
    setTitle("")
    setDescription("")
    setPriority("High")
  }, [tasks]);

  return (
    <div className="container">
      <div className="columns-container">
        <PriorityColumn color="#ffa5a5" deleteTask={deleteTask} priority="High" tasks={highPriorityTasks} />
        <PriorityColumn color="#ffd3a5" deleteTask={deleteTask} priority="Medium" tasks={mediumPriorityTasks} />
        <PriorityColumn color="#fff8a5" deleteTask={deleteTask} priority="Low" tasks={lowPriorityTasks} />
      </div>
      <FormContainer 
        title={title} 
        description={description} 
        priority={priority} 
        setTitle={setTitle}
        setDescription={setDescription}
        setPriority={setPriority}
        addTask={addTask}
        />
    </div>
  );
}

export default App;
