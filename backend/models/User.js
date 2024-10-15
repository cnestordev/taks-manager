const mongoose = require('mongoose');

// User Schema and Model
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
});

// Pre-save hook to ensure username is stored as lowercase
UserSchema.pre('save', function(next) {
  this.username = this.username.toLowerCase();
  next();
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