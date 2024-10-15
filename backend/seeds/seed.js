const mongoose = require('mongoose');
const dotenv = require('dotenv');
const argon2 = require('argon2');
const User = require('../models/User');
const { users } = require('./users');

dotenv.config();

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
const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Delete all users from the User collection
    await User.deleteMany();

    // Hash each user's password and prepare the data
    for (const user of users) {
      user.passwordHash = await hashPassword(user.password); // Hash the password
      delete user.password; // Remove plain-text password
    }

    // Insert new dummy users
    await User.insertMany(users);
    console.log('Database cleared and dummy users successfully seeded!');

    // Close the MongoDB connection
    await mongoose.connection.close();
    process.exit(); // Exit the process
  } catch (error) {
    console.error(`Error seeding users: ${error}`);
    process.exit(1); // Exit with failure
  }
};

// Run the seed function
seedUsers();