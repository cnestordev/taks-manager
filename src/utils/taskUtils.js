import { cleanupTask } from "./taskTransformations";

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

        // Re-sync the task if the server returns something different
        updateTasks(data.tasks);
    } catch (error) {
        // Rollback the optimistic update if there's an error
        updateTasks(selectedTask);
        console.error("Error updating task:", error);
        throw new Error("Task update failed on the server.");
    }
};

// Optimistically add a new task to the UI and sync with the backend
export const addTaskOptimistically = async (
    newTaskData,
    addNewTask,
    updateTask,
    createTaskOnServer,
    removeTask,
    setLoadingTaskId
) => {
    // Generate a temporary ID for the new task
    const tempId = `temp-${Date.now()}`;
    const tempTask = { ...newTaskData, _id: tempId, tempId, taskPosition: [{ ...newTaskData.taskPosition[0], isExpanded: true }] };

    setLoadingTaskId(tempTask._id);

    // Optimistic UI update: Add the new task
    addNewTask(tempTask);

    try {
        // Send the new task data to the server
        const { data } = await createTaskOnServer(newTaskData);
        const createdTask = data.tasks;

        console.log(createdTask);

        // Update the task in the UI with the actual data from the server
        updateTask(createdTask, tempId);
    } catch (error) {
        console.error("Error creating new task:", error);
        // Remove the temporary task from the UI
        removeTask(tempTask);

        // Throw the error to let the caller handle it (e.g., show a toast)
        throw new Error("Task creation failed on the server.");
    } finally {
        setLoadingTaskId(null);
    }
};

// Add a new task
export const handleAddTask = async (newTask, addNewTask, updateTask, createTaskOnServer, removeTask, setLoadingTaskId) => {
    try {
        await addTaskOptimistically(newTask, addNewTask, updateTask, createTaskOnServer, removeTask, setLoadingTaskId);
    } catch (error) {
        throw new Error(error);
    }
};

// Remove a task by marking it as deleted
export const handleRemoveTask = async (updatedTasks, updateTasks, updateTaskOrder, selectedTask) => {
    const cleanedUpTasks = updatedTasks.map(task => cleanupTask(task));
    await updateTasksOptimistically(cleanedUpTasks, updateTasks, updateTaskOrder, selectedTask);
};

// Modify the selected task
export const updateSelectedTask = async (updatedTask, updateTasks, updateTaskOrder, selectedTask) => {
    const cleanedUpTask = cleanupTask(updatedTask);
    await updateTasksOptimistically(cleanedUpTask, updateTasks, updateTaskOrder, selectedTask);
};

export const handleDragEnd = async (
    result,
    tasks,
    updateTasksOnServer,
    updateTasks,
    setLoadingTaskId
) => {
    const { destination, source } = result;

    // If there's no destination (e.g., the task was dropped outside a droppable area), do nothing.
    if (!destination) return;

    // If the task was dropped back in the same position, do nothing.
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return;
    }

    // Create a deep copy of the tasks to avoid mutating the original state.
    let updatedTasks = tasks.map((task) => ({ ...task }));

    const sourcePriority = source.droppableId;
    const destinationPriority = destination.droppableId;

    // Get all tasks in the source and destination columns.
    const sourceTasks = updatedTasks
        .filter((task) => task.priority === sourcePriority);

    const destinationTasks = updatedTasks
        .filter((task) => task.priority === destinationPriority);

    if (source.droppableId === destination.droppableId) {
        const removedTask = sourceTasks.splice(source.index, 1)[0];
        sourceTasks.splice(destination.index, 0, removedTask);
        sourceTasks.forEach((task, i) => task.position = i);
        setLoadingTaskId(removedTask._id);
    } else {
        const removedTask = sourceTasks.splice(source.index, 1)[0];
        removedTask.priority = destination.droppableId;
        destinationTasks.splice(destination.index, 0, removedTask);
        sourceTasks.forEach((task, i) => task.position = i);
        destinationTasks.forEach((task, i) => task.position = i);
        setLoadingTaskId(removedTask._id);
    }
    // Update the tasks in the state optimistically.
    const cleanedUpTask = updatedTasks.map(task => cleanupTask(task));
    updateTasks(cleanedUpTask);

    try {
        // Update the tasks on the server.
        await updateTasksOnServer(cleanedUpTask);
    } catch (error) {
        // If there's an error, revert to the original tasks.
        updateTasks(tasks);
        console.error("Error updating tasks on the server:", error);
        throw error;
    } finally {
        setLoadingTaskId(null);
    }
};



// Expand or collapse individual task
export const toggleExpand = async (task, updateTask, updateTaskOrder, originalTasks) => {
    const cleanedUpTask = cleanupTask(task);
    await updateTasksOptimistically(cleanedUpTask, updateTask, updateTaskOrder, originalTasks);
};

// Expand or collapse all tasks in a priority
export const toggleTaskExpansion = async (tasks, updateTasks, updateTaskOrder, originalTasks) => {
    const cleanedUpTasks = tasks.map(task => cleanupTask(task));
    await updateTasksOptimistically(cleanedUpTasks, updateTasks, updateTaskOrder, originalTasks);
};