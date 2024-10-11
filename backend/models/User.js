const mongoose = require('mongoose');

// User Schema and Model
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
