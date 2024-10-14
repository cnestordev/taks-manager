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
import { useToast } from "@chakra-ui/react";

const Dashboard = () => {
  const { user, updateTasks } = useUser();
  const toast = useToast();
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add a new task
  const addTask = async (formData, cb) => {
    try {
      const { data } = await createTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
      });
      if (data.statusCode === 201 && data.tasks) {
        updateTasks(data.tasks);
        // Close the modal after adding the task
        if (cb) cb();
        toast({
          title: "Task created.",
          description: "Your task has been added successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error("Error creating a new task");
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "An error occurred while creating the task.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onRemoveTask = async () => {
    try {
      await handleRemoveTask(selectedTask, user, updateTasks, updateTaskOrder);
      setSelectedTask(null);
      setIsDeleteModalOpen(false);
      toast({
        title: "Task deleted.",
        description: "Your task has been deleted successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting task:", error);

      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Save changes when editing a task
  const saveTaskChanges = async (formData) => {
    try {
      await updateTasksOptimistically(
        user,
        (originalTasks) =>
          originalTasks.map((task) =>
            task._id === selectedTask._id
              ? {
                  ...task,
                  title: formData.title,
                  description: formData.description,
                  priority: formData.priority,
                }
              : task
          ),
        updateTasks,
        updateTaskOrder
      );
      setSelectedTask(null);
      setIsEditModalOpen(false);
      toast({
        title: "Task updated.",
        description: "Your task has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving task changes:", error);
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleExpand = async (task) => {
    try {
      await toggleExpand(task, user, updateTasks, updateTaskOrder);
    } catch (error) {
      console.error("Error toggling task expansion:", error);
      toast({
        title: "Error",
        description: "Failed to toggle task expansion. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleToggleTaskExpansion = async (priority, expandAll) => {
    try {
      await toggleTaskExpansion(
        priority,
        expandAll,
        user,
        updateTasks,
        updateTaskOrder
      );
    } catch (error) {
      console.error("Error toggling all task expansions:", error);
      toast({
        title: "Error",
        description: "Failed to toggle task expansions. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const onDragUpdate = (update) => {
    const { destination } = update;

    if (destination) {
      setActiveColumn(destination.droppableId);
    } else {
      setActiveColumn(null);
    }
  };

  // Priorities for tasks (columns)
  const priorities = ["High", "Medium", "Low"];

  return (
    <div className="container">
      <Navbar>
        {/* Form to Add New Task */}
        <FormContainer addTask={addTask} />
      </Navbar>

      {/* Delete Task Modal */}
      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        taskTitle={selectedTask ? selectedTask.title : ""}
        handleRemoveTask={onRemoveTask}
      />

      {/* Edit Task Modal */}
      {selectedTask && (
        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          saveTaskChanges={saveTaskChanges}
          selectedTask={selectedTask}
        />
      )}

      {/* Drag and Drop Context */}
      <DragDropContext
        onDragUpdate={onDragUpdate}
        onDragEnd={async (result) => {
          try {
            setActiveColumn(null);
            await handleDragEnd(result, user, updateTasks, updateTaskOrder);
          } catch (error) {
            console.error("Error handling drag end:", error);
            toast({
              title: "Error",
              description: "Failed to update task order. Please try again.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }}
      >
        <div className="columns-container">
          {priorities.map((priority) => (
            <PriorityColumn
              key={priority}
              toggleExpand={handleToggleExpand}
              deleteTask={(task) => {
                setSelectedTask(task);
                setIsDeleteModalOpen(true);
              }}
              editTask={(task) => {
                setSelectedTask(task);
                setIsEditModalOpen(true);
              }}
              toggleTaskExpansion={handleToggleTaskExpansion}
              priority={priority}
              tasks={user.tasks.filter(
                (task) => task.priority === priority && !task.isDeleted
              )}
              isActive={activeColumn === priority}
              id={priority}
            />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
