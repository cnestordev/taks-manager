import { createContext, useContext, useEffect, useState } from "react";
import { getTasks } from "../api";
import { reorderTasks } from "../utils/taskTransformations";
import { useUser } from "./UserContext";

const TaskContext = createContext(null);
export const useTask = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const { user } = useUser();

  // Get User Tasks on initial load
  useEffect(() => {
    const fetchTasks = async () => {
      console.log(user);
      try {
        // Fetch tasks from the database
        const {
          data: { tasks: fetchedTasks },
        } = await getTasks(user);
        const flattenedTasks = reorderTasks(fetchedTasks, user);

        setTasks(flattenedTasks);
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      fetchTasks();
    }
  }, [user]);

  const addNewTask = (newTask) => {
    setTasks((prevTasks) => {
      return reorderTasks([...prevTasks, newTask], user);
    });
  };

  const updateTask = (updatedTask, tempId = null) => {
    setTasks((prevTasks) => {
      let tasksChanged = false;

      const updatedTasks = prevTasks.map((task) => {
        if (tempId && task.tempId === tempId) {
          tasksChanged = true;
          return updatedTask;
        } else if (task._id === updatedTask._id) {
          tasksChanged = true;
          return updatedTask;
        }
        return task;
      });
      if (tasksChanged) {
        return reorderTasks(updatedTasks, user);
      }
      return prevTasks;
    });
  };

  const updateTasks = (tasksToUpdate) => {
    const updateMap = new Map(tasksToUpdate.map((task) => [task._id, task]));

    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map(
        (task) => updateMap.get(task._id) || task
      );
      return reorderTasks(updatedTasks, user);
    });
  };

  //   Remove task from UI if task creation fails on server
  const removeTask = (taskToRemove) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task._id !== taskToRemove._id)
    );
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addNewTask, updateTask, updateTasks, removeTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
