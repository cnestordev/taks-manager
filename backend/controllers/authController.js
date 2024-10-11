const User = require('../models/User');
const argon2 = require('argon2');
const passport = require('passport');

const createResponse = (statusCode, message, user = null, sessionID = null) => ({
    statusCode,
    message,
    user,
    sessionID,
});

// Registration Handler with Auto Login
exports.register = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json(createResponse(400, 'Username and password are required'));
    }

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json(createResponse(400, 'Username already exists'));
        }

        // Hash the password and create the new user
        const passwordHash = await argon2.hash(password);
        const newUser = new User({ username, passwordHash });
        await newUser.save();

        // Log the user in
        req.login(newUser, (err) => {
            if (err) {
                return next(err);
            }

            return res.status(201).json(createResponse(201, 'Registration and login successful', {
                id: newUser._id,
                username: newUser.username,
            }));
        });
    } catch (error) {
        return res.status(500).json(createResponse(500, 'Error registering user'));
    }
};


// Login Handler
exports.login = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(401).json(createResponse(401, info.message || 'Invalid credentials'));

        req.logIn(user, (err) => {
            if (err) return next(err);

            res.status(200).json(createResponse(200, 'Login successful', {
                id: user._id,
                username: user.username,
                email: user.email,
            }));
        });
    })(req, res, next);
};

// Check if User is Logged In
exports.checkUser = (req, res) => {
    if (req.isAuthenticated()) {
        return res.status(200).json(createResponse(200, 'User is authenticated', req.user));
    } else {
        return res.status(401).json(createResponse(401, 'User not authenticated'));
    }
};

// Logout Handler
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json(createResponse(500, 'Error logging out'));

        req.session.destroy((err) => {
            if (err) return res.status(500).json(createResponse(500, 'Error destroying session'));

            res.clearCookie('connect.sid');
            return res.status(200).json(createResponse(200, 'Logged out successfully'));
        });
    });
};