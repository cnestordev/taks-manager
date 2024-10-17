// Optimistically update tasks in the UI and sync with the backend
export const updateTasksOptimistically = async (
    updatedTask,
    updateTasks,
    updateTaskOnServer,
    selectedTask
) => {
    // Optimistic UI update
    updateTasks(updatedTask);

    try {
        // Send the updated task to the server
        const { data } = await updateTaskOnServer(updatedTask);
        console.log(data);
        // Re-sync the task if the server returns something different
        updateTasks(data.task);
    } catch (error) {
        updateTasks(selectedTask)
        console.error("Error updating task:", error);
        throw new Error("Task update failed on the server.");
    }
};

// Optimistically add a new task to the UI and sync with the backend
export const addTaskOptimistically = async (
    newTaskData,
    addNewTask,
    createTaskOnServer,
    removeTask
) => {
    // Generate a temporary ID for the new task
    const tempId = `temp-${Date.now()}`;
    const tempTask = { ...newTaskData, _id: tempId, tempId, isExpanded: true };

    // Optimistic UI update: Add the new task
    addNewTask(tempTask);

    try {
        // Send the new task data to the server
        const { data } = await createTaskOnServer(newTaskData);
        const createdTask = data.tasks;

        // Update the task in the UI with the actual data from the server
        addNewTask(createdTask, tempId);
    } catch (error) {
        console.error("Error creating new task:", error);
        // Remove the temporary task from the UI
        removeTask(tempTask);

        // Throw the error to let the caller handle it (e.g., show a toast)
        throw new Error("Task creation failed on the server.");
    }
};

// Add a new task
export const handleAddTask = async (newTask, addNewTask, createTaskOnServer, removeTask) => {
    try {
        await addTaskOptimistically(newTask, addNewTask, createTaskOnServer, removeTask);
    } catch (error) {
        throw new Error(error);
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
export const handleRemoveTask = async (updatedTask, updateTasks, updateTaskOrder) => {
    await updateTasksOptimistically(updatedTask, updateTasks, updateTaskOrder);
};

// Modify the selected task
export const updateSelectedTask = async (updatedTask, updateTasks, updateTaskOrder, selectedTask) => {
    await updateTasksOptimistically(updatedTask, updateTasks, updateTaskOrder, selectedTask);
};
