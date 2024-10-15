const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env.development';

dotenv.config({ path: envFile });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const sessionConfig = require('./middlewares/sessionConfig');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware Setup
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Session and Passport Middleware
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

// Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
