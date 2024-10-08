import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { DragDropContext } from "@hello-pangea/dnd";
import PriorityColumn from "./components/PriorityColumn";
import FormContainer from "./components/FormContainer";

const App = () => {
  const items = JSON.parse(localStorage.getItem("tasks")) || [];
  const [tasks, setTasks] = useState(items);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [error, setError] = useState("");

  const addTask = (e) => {
    e.preventDefault();

    if (title === "" || description === "") {
      setError("All fields required");
      return;
    }

    setError("");
    setTasks([...tasks, { title, description, priority, id: generateId() }]);
  };

  const generateId = () => Math.random().toString(36).substring(2, 7);

  const deleteTask = (task) => {
    const newTasks = tasks.filter((t) => t.id !== task.id);
    setTasks(newTasks);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If card was not moved, do nothing
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    console.log(
      `Item ${draggableId} was moved from position ${source.index} in ${source.droppableId} to position ${destination.index} in ${destination.droppableId}`
    );

    const updatedTasks = Array.from(tasks);

    // Find the index of the task that was dragged
    const sourceIndex = updatedTasks.findIndex(
      (task) => task.id === draggableId
    );
    const movedTask = {
      ...updatedTasks[sourceIndex],
      priority: destination.droppableId,
    };

    // Remove the task from its original position
    updatedTasks.splice(sourceIndex, 1);

    // Calculate the new index based on the "Low" priority group size
    const destinationPriorityTasks = updatedTasks.filter(
      (task) => task.priority === destination.droppableId
    );
    const destinationIndex =
      destinationPriorityTasks.length >= destination.index
        ? destination.index
        : destinationPriorityTasks.length;

    // Insert the task at its new position in the destination column
    updatedTasks.splice(
      destinationIndex +
        updatedTasks.findIndex(
          (task) => task.priority === destination.droppableId
        ),
      0,
      movedTask
    );

    setTasks(updatedTasks);
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    setTitle("");
    setDescription("");
    setPriority("High");
  }, [tasks]);

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="columns-container">
          <PriorityColumn
            deleteTask={deleteTask}
            priority="High"
            tasks={tasks.filter((task) => task.priority === "High")}
            id="High"
          />
          <PriorityColumn
            deleteTask={deleteTask}
            priority="Medium"
            tasks={tasks.filter((task) => task.priority === "Medium")}
            id="Medium"
          />
          <PriorityColumn
            deleteTask={deleteTask}
            priority="Low"
            tasks={tasks.filter((task) => task.priority === "Low")}
            id="Low"
          />
        </div>
        <FormContainer
          title={title}
          description={description}
          priority={priority}
          error={error}
          setTitle={setTitle}
          setDescription={setDescription}
          setPriority={setPriority}
          addTask={addTask}
        />
      </DragDropContext>
    </div>
  );
};

export default App;
