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
            const { title, description } = req.body;

            // Create a new task document
            const newTask = new Task({
                title,
                description,
                assignedTo: [req.user._id],
                createdBy: req.user._id,
                taskPosition: req.body.taskPosition.map(pos => ({
                    ...pos,
                    isExpanded: true,
                    userId: req.user._id
                }))
            });

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
                assignedTo: req.user._id,
                isDeleted: { $ne: true }
            })
                .select('-modified -__v')
                .lean();

            // Filter taskPosition for the current user
            const filteredTasks = tasks.map(task => {
                const filteredTaskPosition = task.taskPosition.find(pos => pos.userId.equals(req.user._id));
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
        const taskId = req.body._id;

        // Update the task directly in the database
        const task = await Task.findOneAndUpdate(
            { _id: taskId, assignedTo: req.user._id },
            req.body,
            { new: true } // Return updated document
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or not assigned to the user.' });
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
                        _id: taskData._id,
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
            const updatePromises = tasksToUpdate.map((taskData) => {
                return Task.findOneAndUpdate(
                    {
                        _id: taskData._id,
                        assignedTo: { $in: [userId] }
                    },
                    taskData,
                    { new: true, session }
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




