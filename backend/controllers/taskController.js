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

            if (!title || !description || !priority) {
                return res.status(400).json(createResponse(400, 'All task fields are required.'));
            }

            // Create a new task document
            const newTask = new Task({
                title,
                description,
                priority,
                assignedTo: [req.user._id]
            });

            // Save the new Task
            await newTask.save();

            // Update the User document to include the new Task's ObjectId
            req.user.tasks.push(newTask._id);
            await req.user.save();

            // Return the newly created task
            return res.status(201).json(createResponse(201, 'Task created successfully', [newTask]));
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

// Update task order
exports.updateTaskOrder = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const tasks = req.body;

            if (!Array.isArray(tasks)) {
                return res.status(400).json({ message: 'Tasks must be an array.' });
            }

            // Verify that all tasks are assigned to the user
            const assignedTasks = await Task.find({ _id: { $in: tasks }, assignedTo: req.user._id });

            if (assignedTasks.length !== tasks.length) {
                return res.status(400).json({ message: 'Some tasks are not assigned to the user.' });
            }

            // Update the user's 'tasks' array to reflect the new order
            req.user.tasks = tasks;

            // Save the updated user document
            await req.user.save();

            return res.status(200).json({ message: 'Tasks updated successfully' });
        } catch (error) {
            console.error('Error updating tasks:', error);
            return res.status(500).json({ message: 'An error occurred while updating the tasks.' });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};