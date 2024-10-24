import { useToast } from "@chakra-ui/react";
import { DragDropContext } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import {
  createTask,
  updateTaskOrder,
  updateTasksOrderOnServer,
  updateTasksServer,
} from "../api/index";
import "../App.css";
import DeleteTaskModal from "../components/DeleteTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import FormContainer from "../components/FormContainer";
import Navbar from "../components/Navbar";
import PriorityColumn from "../components/PriorityColumn";
import { useTask } from "../context/TaskContext";
import { useUser } from "../context/UserContext";
import { useLoading } from "../context/LoadingContext";
import {
  handleAddTask,
  handleDragEnd,
  handleRemoveTask,
  toggleExpand,
  toggleTaskExpansion,
  updateSelectedTask,
} from "../utils/taskUtils";
import CompletedTaskModal from "./CompletedTaskModal";

const Dashboard = () => {
  const { tasks, addNewTask, removeTask, updateTask, updateTasks } = useTask();
  const { user } = useUser();
  const { loadingTaskId, setLoadingTaskId } = useLoading();
  const toast = useToast();
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeColumn, setActiveColumn] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);

  // Add a new task
  const addTask = async (formData) => {
    console.log(formData);
    console.log(user);
    const newTaskPosition = tasks.filter(
      (task) => task.priority === formData.priority
    ).length;
    try {
      await handleAddTask(
        {
          title: formData.title,
          description: formData.description,
          assignedTo: [...formData.addedUsers.map((user) => user._id)],
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
        removeTask,
        setLoadingTaskId
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

      const copiedTasks = JSON.parse(JSON.stringify(tasks));
      const backUpTasks = JSON.parse(JSON.stringify(tasks));

      const updatedTask = { ...selectedTask, isDeleted: true };

      // new array of tasks excluding the deleted task
      const remainingTasks = copiedTasks.filter(
        (task) => task._id !== selectedTask._id
      );

      // tasks of the same priority that are not deleted
      const samePriorityTasks = remainingTasks.filter(
        (task) => task.priority === selectedTask.priority
      );

      // sort these tasks by their current position
      samePriorityTasks.sort((a, b) => a.position - b.position);

      // reassign positions to remaining tasks with the same priority
      let currentIndex = 0;
      samePriorityTasks.forEach((task) => {
        if (task.position >= 0) {
          task.position = currentIndex;
          currentIndex++;
        }
      });

      // Prepare the payload
      const recalucatedTasks = [...samePriorityTasks, updatedTask];

      await handleRemoveTask(
        recalucatedTasks,
        updateTasks,
        updateTasksOrderOnServer,
        backUpTasks
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

  // Toggle a task's completed status
  const onToggleTaskCompletion = async () => {
    try {
      const copiedTasks = JSON.parse(JSON.stringify(tasks));
      const backUpTasks = JSON.parse(JSON.stringify(tasks));

      // Toggle the isCompleted value
      const updatedTask = {
        ...selectedTask,
        isCompleted: !selectedTask.isCompleted,
      };

      let recalculatedTasks;

      if (updatedTask.isCompleted) {
        // When the task is completed: remove it from the list and reassign positions
        const remainingTasks = copiedTasks.filter(
          (task) => task._id !== selectedTask._id
        );

        const samePriorityTasks = remainingTasks.filter(
          (task) => task.priority === selectedTask.priority
        );

        const sameCompletedStatus = samePriorityTasks.filter(
          (task) => task.isCompleted === false
        );

        // Sort these tasks by their current position
        sameCompletedStatus.sort((a, b) => a.position - b.position);

        // Reassign positions to remaining tasks with the same priority
        sameCompletedStatus.forEach((task, index) => {
          task.position = index;
        });

        recalculatedTasks = [...sameCompletedStatus, updatedTask];
      } else {
        // When the task is reverted to incomplete: add it to the end of the array
        const remainingTasks = copiedTasks.filter(
          (task) => task._id !== selectedTask._id
        );

        const samePriorityTasks = remainingTasks.filter(
          (task) => task.priority === selectedTask.priority
        );

        // Sort these tasks by their current position
        samePriorityTasks.sort((a, b) => a.position - b.position);

        // Add the updated task to the end with the correct new position
        updatedTask.position = samePriorityTasks.length;
        recalculatedTasks = [...samePriorityTasks, updatedTask];
      }

      await handleRemoveTask(
        recalculatedTasks,
        updateTasks,
        updateTasksOrderOnServer,
        backUpTasks
      );

      setSelectedTask(null);

      toast({
        title: updatedTask.isCompleted
          ? "Task completed."
          : "Task marked incomplete.",
        description: updatedTask.isCompleted
          ? "Your task has been marked as completed successfully."
          : "Your task has been marked as incomplete and moved to the end.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error toggling task completion:", error);

      toast({
        title: "Error",
        description: "Failed to toggle task completion. Please try again.",
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
      setLoadingTaskId(updatedData._id);

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
    } finally {
      setLoadingTaskId(null);
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
      {/* Completed Task Modal */}
      {selectedTask && (
        <CompletedTaskModal
          isOpen={isCompletedModalOpen}
          onClose={() => setIsCompletedModalOpen(false)}
          task={selectedTask}
          handleCompletedTask={onToggleTaskCompletion}
        />
      )}

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
            await handleDragEnd(
              result,
              tasks,
              updateTasksOrderOnServer,
              updateTasks,
              setLoadingTaskId
            );
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
              completedTask={(task) => {
                setSelectedTask(task);
                setIsCompletedModalOpen(true);
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
