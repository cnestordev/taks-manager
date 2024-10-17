import { createContext, useContext, useState, useEffect } from "react";
import { getTasks } from "../api";
import { useUser } from "./UserContext";

const TaskContext = createContext(null);
export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useUser();

  // Get User Tasks on initial load
  useEffect(() => {
    const getUserTasks = async () => {
      try {
        const { data } = await getTasks(user);
        setTasks(data.tasks);
      } catch (error) {
        // Handle errors
      } finally {
        // Perform any final tasks
      }
    };

    getUserTasks();
  }, [user]);

  const addNewTask = (newTask, tempId) => {
    setTasks((prevTasks) => {
      if (tempId) {
        console.log("Here!!!")
        // Replace task with matching tempId
        return prevTasks.map((task) =>
          task.tempId === tempId ? newTask : task
        );
      }
      // If no tempId, add the new task
      return [...prevTasks, newTask];
    });
  };

  const updateTask = (taskToUpdate) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task._id === taskToUpdate._id ? taskToUpdate : task
      );
    });
  };

  const removeTask = (taskToRemove) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== taskToRemove._id)
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addNewTask, updateTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};
