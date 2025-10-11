const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true, // 7. Search course on search bar
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true, // Must be an Admin user
    },
    // The list of lectures for the course
    lectures: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Lecture',
        }
    ],
    totalEnrollments: { // For admin analytics
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);