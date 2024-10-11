const User = require('../models/User');
const argon2 = require('argon2');
const passport = require('passport');

const createResponse = (statusCode, message, tasks = []) => ({
    statusCode,
    message,
    tasks,
});

// Create a new task
exports.createTask = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            // Validate task input (title, description, priority)
            const { title, description, priority } = req.body;

            if (!title || !description || !priority) {
                return res.status(400).json(createResponse(400, 'All task fields are required.'));
            }

            // Push the new task into the user's tasks array
            req.user.tasks.push({ title, description, priority });

            // Save the updated user document
            await req.user.save();

            // Return the newly created task or the updated list of tasks
            return res.status(201).json(createResponse(201, 'Task created successfully', req.user.tasks));
        } catch (error) {
            console.error('Error creating task:', error);
            return res.status(500).json(createResponse(500, 'An error occurred while creating the task.'));
        }
    } else {
        return res.status(401).json(createResponse(401, 'User not authenticated'));
    }
};

exports.updateTaskOrder = async (req, res) => {
    if (req.isAuthenticated()) {
        try {
            const tasks = req.body;

            if (!Array.isArray(tasks)) {
                return res.status(400).json({ message: 'Tasks must be an array.' });
            }

            // Replace the user's existing tasks array with the reordered tasks array
            req.user.tasks = tasks;

            // Save the updated user document
            await req.user.save();

            // Return the updated task list
            return res.status(200).json({ message: 'Tasks updated successfully', tasks: req.user.tasks });
        } catch (error) {
            console.error('Error updating tasks:', error);
            return res.status(500).json({ message: 'An error occurred while updating the tasks.' });
        }
    } else {
        return res.status(401).json({ message: 'User not authenticated' });
    }
};

