const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Don't return the password by default
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // 1. Role-based authentication
        default: 'user',
    },
    // This is useful for user dashboard (4. User Dashboard)
    enrolledCourses: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Enrollment', // Reference to the Enrollment model
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);