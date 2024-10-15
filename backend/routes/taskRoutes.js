const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateTask = require('../middleware/validateTask');

// Task Routes
router.post('/create', validateTask, taskController.createTask);
router.post('/updateTaskOrder', validateTask, taskController.updateTaskOrder);

module.exports = router;
