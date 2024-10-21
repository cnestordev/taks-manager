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
const sessionConfig = require('./middleware/sessionConfig');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();
// Middleware Setup
app.use(cors({
    origin: [process.env.VITE_LOCAL_HOST, process.env.VITE_LOCAL_IP],
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
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
