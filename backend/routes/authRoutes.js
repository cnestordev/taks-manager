const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.checkUser);
router.get('/logout', authController.logout);

module.exports = router;
