// App.jsx
import { useState } from 'react';
import './App.css';
import PriorityColumn from './components/PriorityColumn';

function App() {
  const [tasks, setTasks] = useState([
    { title: "Task 1", description: "Description 1", priority: "High" },
    { title: "Task 2", description: "Description 2", priority: "Medium" },
    { title: "Task 3", description: "Description 3", priority: "Low" },
  ]);

  function addTask(newTask) {
    setTasks([...tasks, newTask]);
  }

  const highPriorityTasks = tasks.filter(task => task.priority === "High");
  const mediumPriorityTasks = tasks.filter(task => task.priority === "Medium");
  const lowPriorityTasks = tasks.filter(task => task.priority === "Low");

  return (
    <>
      <div className="column-container">
        <button onClick={() => addTask({ title: "Task 4", description: "Description 4", priority: "High" })}>+</button>
        <PriorityColumn priority="High" tasks={highPriorityTasks} />
        <PriorityColumn priority="Medium" tasks={mediumPriorityTasks} />
        <PriorityColumn priority="Low" tasks={lowPriorityTasks} />
      </div>
    </>
  );
}

export default App;
