const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production'
    ? '.env.production'
    : process.env.NODE_ENV === 'test'
        ? '.env.test'
        : '.env.development';

dotenv.config({ path: envFile });

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const sessionConfig = require('./middleware/sessionConfig');
const passport = require('./config/passportConfig');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const SocketSession = require("./models/SocketSession")

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");

// Connect to Database
connectDB();

// Middleware Setup
app.use(cors({
    origin: [process.env.VITE_LOCAL_HOST, process.env.VITE_LOCAL_IP],
    credentials: true
}));

// WebSocket Setup
const io = socketIo(server, {
    cors: {
        origin: [process.env.VITE_LOCAL_HOST, process.env.VITE_LOCAL_IP],
        methods: ['GET', 'POST'],
        credentials: true,
        transports: ['websocket', 'polling']
    },
    allowEIO3: true,
});

const sendMessageToUser = async (userId, message) => {
    try {
        // Find the session for the user
        const session = await SocketSession.findOne({ userId: userId });
        if (session && session.socketIds.length > 0) {
            // Loop through all socketIds and send the message to each connection
            session.socketIds.forEach((socketId) => {
                io.to(socketId).emit('message', message);
            });
        }
    } catch (err) {
        console.error('Error sending message to user:', err);
    }
};

io.on('connection', async (socket) => {
    let userId, username;

    try {
        userId = new mongoose.Types.ObjectId(socket.handshake.query.userId);
        username = socket.handshake.query.username;
    } catch (error) {
        console.error('Invalid userId or username provided:', socket.handshake.query);
        return socket.disconnect(true);
    }

    console.log(`User ${username} (ID: ${userId}) connected with socket ID: ${socket.id}`);

    try {
        // Add the new socket.id to the session in the database
        await SocketSession.updateOne(
            { userId: userId },
            { $push: { socketIds: socket.id } },
            { upsert: true }
        );
        sendMessageToUser(userId, "Welcome!")
    } catch (err) {
        console.error('Error saving socket ID for user:', username, err);
    }

    // Handle task room joining
    socket.on('joinTaskRoom', (taskId) => {
        socket.join(taskId);
        console.log(`User ${username} joined task room: ${taskId}`);
    });

    // Handle task updates
    socket.on('taskUpdated', (task) => {
        const taskId = task._id;
        if (taskId) {
            io.to(taskId).emit('taskUpdated', task);
            console.log(`User ${username} updated task ${taskId}`);
        } else {
            console.error('Task ID is missing or invalid for user:', username);
        }
    });

    // Handle user disconnection
    socket.on('disconnect', async () => {
        console.log(`User ${username} disconnected with socket ID: ${socket.id}`);
        try {
            await SocketSession.updateOne(
                { userId: userId },
                { $pull: { socketIds: socket.id } }
            );
            console.log(`Socket ID ${socket.id} removed for user ${username}`);
        } catch (err) {
            console.error('Error removing socket ID for user:', username, err);
        }
    });
});

app.use(express.json());

// Session and Passport Middleware
app.use(sessionConfig);
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${PORT}`));
