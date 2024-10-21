export const reorderTasks = (fetchedTasks, user) => {
    // Process and organize tasks
    const organizedTasks = {
        High: [],
        Medium: [],
        Low: [],
    };
    fetchedTasks.forEach((task, i) => {
        task.taskPosition.forEach((tp) => {
            if (task._id.startsWith("temp") || tp.userId === user.id) {
                organizedTasks[tp.priority].push({
                    ...task,
                    position: tp.position,
                    isExpanded: tp.isExpanded,
                    priority: tp.priority,
                });
            }
        });
    });

    // Sort tasks within each priority
    Object.keys(organizedTasks).forEach((priority) => {
        organizedTasks[priority].sort((a, b) => a.position - b.position);
    });

    const finalArray = Object.values(organizedTasks).flat();

    return finalArray;
};

export const cleanupTask = (taskToClean) => {
    let updatedTask = { ...taskToClean };

    if (!updatedTask.taskPosition || updatedTask.taskPosition.length === 0) {
        updatedTask.taskPosition = [{}];
    }

    // Move fields from top level to nested taskPosition[0]
    updatedTask.taskPosition[0].isExpanded = updatedTask.isExpanded;
    updatedTask.taskPosition[0].position = updatedTask.position;
    updatedTask.taskPosition[0].priority = updatedTask.priority;


    const { isExpanded, priority, position, ...cleanedTask } = updatedTask;

    return cleanedTask;
};
