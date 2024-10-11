const mongoose = require('mongoose');

// Task Schema
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now },
  isExpanded: { type: Boolean, default: true }
});

// User Schema and Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  tasks: [TaskSchema],
});

// Exclude password when converting to JSON
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.passwordHash;
    return ret;
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
