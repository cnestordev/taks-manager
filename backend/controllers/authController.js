const User = require('../models/User');
const argon2 = require('argon2');
const passport = require('passport');

// Registration Handler
exports.register = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    try {
        const passwordHash = await argon2.hash(password);
        const newUser = new User({ username, passwordHash });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).send('Username already exists');
        } else {
            res.status(500).send('Error registering user');
        }
    }
};

// Login Handler
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).send(info.message || 'Invalid credentials');

        req.logIn(user, (err) => {
            if (err) return next(err);
            res.send('Login successful');
        });
    })(req, res, next);
};

// Check if User is Logged In
exports.checkUser = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ loggedIn: true, user: req.user });
    } else {
        res.json({ loggedIn: false });
    }
};

// Logout Handler
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).send('Error logging out');
        res.send('Logged out successfully');
    });
};
