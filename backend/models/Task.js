const mongoose = require('mongoose');

// Task Schema
const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], required: true },
    isDeleted: { type: Boolean, default: false },
    created: { type: Date, default: Date.now },
    modified: { type: Date, default: null },
    isExpanded: { type: Boolean, default: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

// Middleware to update the modified field before updating the document
TaskSchema.pre('findOneAndUpdate', function (next) {
    this.set({ modified: Date.now() });
    next();
});

TaskSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        delete ret.modified;
        return ret;
    }
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;