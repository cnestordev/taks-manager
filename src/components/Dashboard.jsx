import { DragDropContext } from "@hello-pangea/dnd";
import { useState } from "react";
import "../App.css";
import FormContainer from "../components/FormContainer";
import Navbar from "../components/Navbar";
import PriorityColumn from "../components/PriorityColumn";
import { useUser } from "../context/UserContext";
import { createTask, updateTaskOrder } from "../api/index";
import {
  updateTasksOptimistically,
  handleDragEnd,
  toggleExpand,
  toggleTaskExpansion,
  handleRemoveTask,
} from "../utils/taskUtils";
import EditTaskModal from "../components/EditTaskModal";
import DeleteTaskModal from "../components/DeleteTaskModal";

const Dashboard = () => {
  const { user, updateTasks } = useUser();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add a new task
  const addTask = async (e, cb) => {
    e.preventDefault();
    if (!title || !description) {
      setError("All fields required");
      return;
    }

    try {
      const { data } = await createTask({ title, description, priority });
      if (data.statusCode === 201 && data.tasks) {
        updateTasks(data.tasks);
        setError("");
        cb();
        setTitle("");
        setDescription("");
        setPriority("");
      } else {
        throw new Error("Error creating a new task");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Save changes when editing a task
  const saveTaskChanges = async () => {
    await updateTasksOptimistically(
      user,
      (originalTasks) =>
        originalTasks.map((task) =>
          task._id === selectedTask._id
            ? { ...task, title, description, priority }
            : task
        ),
      updateTasks,
      updateTaskOrder
    );
    setSelectedTask(null);
    setIsEditModalOpen(false);
  };

  // Priorities for tasks (columns)
  const priorities = ["High", "Medium", "Low"];

  return (
    <div className="container">
      <Navbar />

      {/* Delete Task Modal */}
      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        taskTitle={selectedTask ? selectedTask.title : ""}
        handleRemoveTask={() => {
          handleRemoveTask(selectedTask, user, updateTasks, updateTaskOrder);
          setIsDeleteModalOpen(false);
        }}
      />

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          priority={priority}
          setPriority={setPriority}
          saveTaskChanges={saveTaskChanges}
        />
      )}

      {/* Drag and Drop Context */}
      <DragDropContext
        onDragEnd={(result) =>
          handleDragEnd(result, user, updateTasks, updateTaskOrder)
        }
      >
        <div className="columns-container">
          {priorities.map((priority) => (
            <PriorityColumn
              key={priority}
              toggleExpand={(task) =>
                toggleExpand(task, user, updateTasks, updateTaskOrder)
              }
              deleteTask={(task) => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              editTask={(task) => {
                setSelectedTask(task);
                setTitle(task.title);
                setDescription(task.description);
                setPriority(task.priority);
                setIsEditModalOpen(true);
              }}
              toggleTaskExpansion={(expandAll) =>
                toggleTaskExpansion(
                  priority,
                  expandAll,
                  user,
                  updateTasks,
                  updateTaskOrder
                )
              }
              priority={priority}
              tasks={user.tasks.filter(
                (task) => task.priority === priority && !task.isDeleted
              )}
              id={priority}
            />
          ))}
        </div>

        {/* Form to Add New Task */}
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

export default Dashboard;
