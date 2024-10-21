import { useToast } from "@chakra-ui/react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { createTask, updateTaskOrder, updateTasksServer, updateTasksOrderOnServer } from "../api/index";
import "../App.css";
import DeleteTaskModal from "../components/DeleteTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import FormContainer from "../components/FormContainer";
import Navbar from "../components/Navbar";
import PriorityColumn from "../components/PriorityColumn";
import { useTask } from "../context/TaskContext";
import { useUser } from "../context/UserContext";
import {
  handleAddTask,
  handleDragEnd,
  handleRemoveTask,
  toggleExpand,
  toggleTaskExpansion,
  updateSelectedTask,
} from "../utils/taskUtils";

const Dashboard = () => {
  const { user } = useUser();
  const { tasks, addNewTask, removeTask, updateTask, updateTasks } = useTask();
  const toast = useToast();
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Add a new task
  const addTask = async (formData, onClose) => {
    onClose();
    const newTaskPosition = tasks.filter(
      (task) => task.priority === formData.priority
    ).length;
    try {
      await handleAddTask(
        {
          title: formData.title,
          description: formData.description,
          taskPosition: [
            {
              priority: formData.priority,
              position: newTaskPosition,
            },
          ],
        },
        addNewTask,
        updateTask,
        createTask,
        removeTask
      );
      toast({
        title: "Task created.",
        description: "Your task has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
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
      setIsDeleteModalOpen(false);
      const updatedTask = { ...selectedTask, isDeleted: true };
      await handleRemoveTask(
        updatedTask,
        updateTask,
        updateTaskOrder,
        selectedTask
      );
      setSelectedTask(null);
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
  const saveTaskChanges = async (formData, resetForm) => {
    try {
      const updatedData = JSON.parse(JSON.stringify(selectedTask));
      updatedData.title = formData.title;
      updatedData.description = formData.description;
      updatedData.priority = formData.priority;

      await updateSelectedTask(
        updatedData,
        updateTask,
        updateTaskOrder,
        selectedTask
      );
      setIsEditModalOpen(false);
      setSelectedTask(null);
      resetForm();
      toast({
        title: "Task updated.",
        description: "Your task has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      setIsEditModalOpen(true);
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
      const updatedTask = { ...task, isExpanded: !task.isExpanded };
      await toggleExpand(updatedTask, updateTask, updateTaskOrder, task);
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

  const handleToggleTaskExpansion = async (priority, boolean) => {
    const updatedTasks = tasks.map((task) =>
      task.priority === priority ? { ...task, isExpanded: boolean } : task
    );
    const originalTasks = [...tasks];
    try {
      await toggleTaskExpansion(
        updatedTasks,
        updateTasks,
        updateTasksServer,
        originalTasks
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
            setActiveColumn(null)
            await handleDragEnd(result, tasks, updateTasksOrderOnServer, updateTasks );
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
              tasks={tasks?.filter(
                (task) => task?.priority === priority && !task?.isDeleted
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
