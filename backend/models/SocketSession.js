const mongoose = require('mongoose');

const socketSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    socketIds: [{
        type: String
    }],
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h'
    }
});

const SocketSession = mongoose.model('SocketSession', socketSessionSchema);
module.exports = SocketSession;
