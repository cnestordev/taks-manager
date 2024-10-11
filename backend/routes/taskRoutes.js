const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController')

// Task Routes
router.post('/create', taskController.createTask);

module.exports = router;
