// Optimistically update tasks in the UI and sync with the backend
export const updateTasksOptimistically = async (
    user,
    updateFunction,
    updateTasks,
    updateTaskOrder
  ) => {
    const originalTasks = Array.from(user.tasks);
    const updatedTasks = updateFunction(originalTasks);
  
    // Optimistic UI update
    updateTasks(updatedTasks);
  
    try {
      // Send the updated tasks array to the server
      const { data } = await updateTaskOrder(updatedTasks);
      // Re-sync the tasks if the server returns something different
      updateTasks(data.tasks);
    } catch (error) {
      console.error("Error updating task order:", error);
      // Rollback to original tasks if an error occurs
      updateTasks(originalTasks);
  
      // Throw the error to let the caller handle it (show a toast)
      throw new Error("Task update failed on the server.");
    }
  };  

// Handle task drag-and-drop logic
export const handleDragEnd = async (result, user, updateTasks, updateTaskOrder) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
    }

    await updateTasksOptimistically(
        user,
        (originalTasks) => {
            const updatedTasks = Array.from(originalTasks);

            const sourceIndex = updatedTasks.findIndex((task) => task._id === draggableId);
            const movedTask = { ...updatedTasks[sourceIndex], priority: destination.droppableId };

            updatedTasks.splice(sourceIndex, 1);

            const destinationPriorityTasks = updatedTasks.filter(
                (task) => task.priority === destination.droppableId
            );
            const destinationIndex =
                destinationPriorityTasks.length >= destination.index
                    ? destination.index
                    : destinationPriorityTasks.length;

            updatedTasks.splice(
                destinationIndex + updatedTasks.findIndex((task) => task.priority === destination.droppableId),
                0,
                movedTask
            );

            return updatedTasks;
        },
        updateTasks,
        updateTaskOrder
    );
};

// Expand or collapse individual task
export const toggleExpand = async (task, user, updateTasks, updateTaskOrder) => {
    await updateTasksOptimistically(
        user,
        (originalTasks) =>
            originalTasks.map((t) =>
                t._id === task._id ? { ...t, isExpanded: !t.isExpanded } : t
            ),
        updateTasks,
        updateTaskOrder
    );
};

// Expand or collapse all tasks in a priority
export const toggleTaskExpansion = async (priority, expandAll, user, updateTasks, updateTaskOrder) => {
    console.log(priority)
    console.log(expandAll)
    await updateTasksOptimistically(
        user,
        (originalTasks) =>
            originalTasks.map((task) =>
                task.priority === priority ? { ...task, isExpanded: expandAll } : task
            ),
        updateTasks,
        updateTaskOrder
    );
};

// Remove a task by marking it as deleted
export const handleRemoveTask = async (selectedTask, user, updateTasks, updateTaskOrder) => {
    await updateTasksOptimistically(
        user,
        (originalTasks) =>
            originalTasks.map((task) =>
                task._id === selectedTask._id ? { ...task, isDeleted: true } : task
            ),
        updateTasks,
        updateTaskOrder
    );
};
