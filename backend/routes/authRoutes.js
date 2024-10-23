const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateUser, validateLogin } = require('../middleware/validateUser');

// Auth Routes
router.post('/register', validateUser, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/user', authController.checkUser);
router.get('/logout', authController.logout);
router.get('/allUsers', authController.getAllUsers);

module.exports = router;
