const Task = require('../models/Task');
const mongoose = require("mongoose");

const createResponse = (statusCode, message, tasks = []) => ({
    statusCode,
    message,
    tasks,
});

// Create a new task
exports.createTask = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { title, description, assignedTo } = req.body;

            // Create a new task document
            const newTask = new Task({
                title,
                description,
                assignedTo: [req.user._id, ...assignedTo],
                createdBy: req.user._id,
                taskPosition: [
                    // Map over taskPosition for the task creator
                    ...req.body.taskPosition.map(pos => ({
                        ...pos,
                        userId: req.user._id,
                        position: pos.position
                    })),
                    ...assignedTo.map(userId => ({
                        priority: req.body.taskPosition[0].priority,
                        userId: new mongoose.Types.ObjectId(userId),
                        position: -1
                    }))
                ]
            });

            // Save the new task
            await newTask.save();

            // Save the new Task
            await newTask.save();

            // Return the newly created task
            return res.status(201).json(createResponse(201, 'Task created successfully', newTask));
        } catch (error) {
            console.error('Error creating task:', error);
            return res.status(500).json(createResponse(500, 'An error occurred while creating the task.'));
        }
    } else {
        return res.status(401).json(createResponse(401, 'User not authenticated'));
    }
};

// Get tasks assigned to the user
exports.getTasks = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Find tasks assigned to the user
            const tasks = await Task.find({
                assignedTo: { $in: [req.user._id] },
                isDeleted: { $ne: true }
            })
                .select('-modified -__v')
                .lean();

            // Filter taskPosition for the current user
            const filteredTasks = tasks.map(task => {
                const filteredTaskPosition = task.taskPosition.find(pos => pos.userId.toString() === req.user._id.toString());
                return {
                    ...task,
                    taskPosition: filteredTaskPosition ? [filteredTaskPosition] : []
                };
            });

            return res.status(200).json(createResponse(200, 'Tasks retrieved successfully', filteredTasks));
        } catch (error) {
            console.error('Error retrieving tasks:', error);
            return res.status(500).json({ message: 'An error occurred while retrieving the tasks.' });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};

// Update existing Task
exports.updateTaskOrder = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    try {
        const taskId = new mongoose.Types.ObjectId(req.body._id);
        const userId = req.user._id;
        const userTaskPosition = req.body.taskPosition[0]; // The taskPosition for the current user

        // Update both taskPosition for the current user and other task fields
        const task = await Task.findOneAndUpdate(
            { _id: taskId, 'taskPosition.userId': userId },  // Find task and specific user's taskPosition
            {
                $set: {
                    // Update relevant fields in taskPosition
                    'taskPosition.$.priority': userTaskPosition.priority,
                    'taskPosition.$.position': userTaskPosition.position,
                    'taskPosition.$.isExpanded': userTaskPosition.isExpanded,

                    // Update other fields in the task from req.body
                    title: req.body.title,
                    description: req.body.description,
                    isDeleted: req.body.isDeleted,
                    isCompleted: req.body.isCompleted,
                    assignedTo: req.body.assignedTo
                }
            },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or task position for user not found.' });
        }

        return res.status(200).json(createResponse(200, 'Task updated successfully', task));
    } catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'An error occurred while updating the task.' });
    }
};

// Update multiple tasks
exports.updateTasksServer = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const tasksToUpdate = req.body;

            // Iterate through tasks and update each one
            const updatePromises = tasksToUpdate.map((taskData) => {
                return Task.findOneAndUpdate(
                    {
                        _id: new mongoose.Types.ObjectId(taskData._id),
                        assignedTo: { $in: [req.user._id] }
                    },
                    taskData,
                    { new: true }
                );
            });

            // Execute all update operations
            const updatedTasks = await Promise.all(updatePromises);

            // Check if any tasks were not found (null values in the array)
            const failedUpdates = updatedTasks.filter((task) => !task);
            if (failedUpdates.length > 0) {
                return res.status(404).json({
                    message: `${failedUpdates.length} tasks were not found or not assigned to the user.`,
                });
            }

            const allUpdatedTasks = await Task.find({
                assignedTo: req.user._id,
                isDeleted: { $ne: true }
            });

            return res.status(200).json(createResponse(200, 'Tasks updated successfully', allUpdatedTasks));
        } catch (error) {
            console.error('Error updating tasks:', error);
            return res.status(500).json({ message: 'An error occurred while updating tasks.' });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};

// Update multiple tasks
const updateMultipleTasksWithTransaction = async (tasksToUpdate, userId) => {
    const session = await mongoose.startSession();
    try {
        const transactionResult = await session.withTransaction(async () => {
            const userIdObj = new mongoose.Types.ObjectId(userId);

            const updatePromises = tasksToUpdate.map((taskData) => {

                const buildSetObject = () => {
                    const setObj = {};

                    // Handle other fields
                    const allowedFields = ['title', 'description', 'isDeleted', 'isCompleted'];
                    allowedFields.forEach(field => {
                        if (taskData[field] !== undefined) {
                            setObj[field] = taskData[field];
                        }
                    });

                    // Update the taskPosition array
                    setObj.taskPosition = {
                        $concatArrays: [
                            {
                                $filter: {
                                    input: '$taskPosition',
                                    cond: {
                                        $ne: [
                                            { $toString: '$$this.userId' },
                                            userIdObj.toString()
                                        ]
                                    }
                                }
                            },
                            [
                                {
                                    ...taskData.taskPosition[0],
                                    userId: userIdObj
                                }
                            ]
                        ]
                    };
                    return setObj;
                };

                // Prepare the aggregation pipeline update
                const update = [
                    {
                        $set: buildSetObject()
                    }
                ];

                const options = { new: true, session };

                return Task.findOneAndUpdate(
                    {
                        _id: new mongoose.Types.ObjectId(taskData._id),
                        assignedTo: { $in: [userIdObj] }
                    },
                    update,
                    options
                );
            });

            const updatedTasks = await Promise.all(updatePromises);

            // Check if any tasks were not found or not updated
            const failedUpdates = updatedTasks.filter((task) => !task);
            if (failedUpdates.length > 0) {
                throw new Error(`${failedUpdates.length} tasks were not found or not assigned to the user.`);
            }

            // If all tasks are successfully updated, return the updated tasks
            return { success: true, updatedTasks };
        });

        // Return the transaction result if successful
        return transactionResult;
    } catch (error) {
        console.error('Error during transaction:', error);
        return { success: false, message: 'An error occurred during the transaction.', error };
    } finally {
        session.endSession();
    }
};

exports.updateTasksOrderServer = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const tasksToUpdate = req.body;

            if (!Array.isArray(tasksToUpdate)) {
                return res.status(400).json({ message: 'Invalid input. Expected an array of tasks.' });
            }

            const result = await updateMultipleTasksWithTransaction(tasksToUpdate, req.user._id);

            if (!result.success) {
                return res.status(404).json({ message: result.message });
            }

            // Fetch all tasks assigned to the user after the updates
            const allUpdatedTasks = await Task.find({
                assignedTo: req.user._id,
                isDeleted: { $ne: true }
            });

            return res.status(200).json(createResponse(200, 'Tasks updated successfully', allUpdatedTasks));
        } catch (error) {
            console.error('Error updating tasks:', error);
            return res.status(500).json({ message: 'An error occurred while updating tasks.', error });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};