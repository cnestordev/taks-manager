require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const sessionConfig = require('./middlewares/sessionConfig');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware Setup
app.use(cors());
app.use(express.json());

// Session and Passport Middleware
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use('/auth', authRoutes);

// Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
