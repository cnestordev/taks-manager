const Task = require('../models/Task');
const User = require('../models/User');

const createResponse = (statusCode, message, tasks = []) => ({
    statusCode,
    message,
    tasks,
});

// Create a new task
exports.createTask = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const { title, description, priority } = req.body;

            // Create a new task document
            const newTask = new Task({
                title,
                description,
                priority,
                assignedTo: [req.user._id]
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
            const tasks = await Task.find({ assignedTo: req.user._id });

            return res.status(200).json(createResponse(200, 'Tasks retrieved successfully', tasks));
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
    if (req.isAuthenticated()) {
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

            return res.status(200).json({ message: 'Task updated successfully', task });
        } catch (error) {
            console.error('Error updating task:', error);
            return res.status(500).json({ message: 'An error occurred while updating the task.' });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};

