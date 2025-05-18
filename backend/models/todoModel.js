const mongoose = require('mongoose');

const todoModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'user id is required.']
    },
    title: {
        type: String,
        required: [true, 'title field is required.'],
    },
    date: {
        type: Date,
        required: [true, 'date field is required.']
    },
    time: {
        type: String,
        required: [true, 'time field is required.']
    },
    isCompleted: {
        type: Number,
        enum: [0, 1],
        required: true,
        default: 0
    },
    isDeleted: {
        type: Number,
        enum: [0, 1],
        required: true,
        default: 0
    }
},
    { timestamps: true }
);

const Todo = mongoose.model('Todo', todoModel);
module.exports = Todo;