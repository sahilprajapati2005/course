const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    // 8. Admin uploads videos lecture that store in a cloudinary.
    videoUrl: {
        type: String, // The secure URL provided by Cloudinary
        required: true,
    },
    cloudinaryPublicId: {
        type: String, // The public ID to delete/manage the video on Cloudinary
        required: true,
    },
    duration: String, // e.g., "15:30"
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course', // Links the lecture back to its parent course
        required: true,
    },
    order: { // For sequencing the lectures
        type: Number,
        default: 1,
    }
}, { timestamps: true });

module.exports = mongoose.model('Lecture', lectureSchema);