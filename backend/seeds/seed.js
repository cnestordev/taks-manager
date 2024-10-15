const dotenv = require('dotenv');
const mongoose = require('mongoose');
const argon2 = require('argon2');
const User = require('../models/User');
const Task = require('../models/Task');
const { users } = require('./users');
const { generateTasksForUser } = require('./tasks');

// Environment setup
const envFile = process.env.NODE_ENV === 'production'
  ? '.env.production'
  : process.env.NODE_ENV === 'test'
    ? '.env.test'
    : '.env.development';

dotenv.config({ path: envFile });

// Hash password function
const hashPassword = async (password) => {
  try {
    return await argon2.hash(password);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    // Delete all users and tasks
    await Promise.all([User.deleteMany(), Task.deleteMany()]);

    // Seed users
    const userPromises = users.map(async (user) => {
      user.passwordHash = await hashPassword(user.password); // Hash the password
      delete user.password; // Remove plain-text password
      return User.create(user);
    });

    // Await all user creation and store the resulting users
    const createdUsers = await Promise.all(userPromises);

    // Seed tasks for each user
    const taskPromises = createdUsers.map((user) => {
      const tasks = generateTasksForUser(user._id); // Pass the user ID to generate tasks
      return Task.insertMany(tasks);
    });

    // Await all task creation
    await Promise.all(taskPromises);

    console.log('Database cleared and seeded with users and tasks successfully!');

    // Close the MongoDB connection
    await mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error(`Error seeding the database: ${error}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
