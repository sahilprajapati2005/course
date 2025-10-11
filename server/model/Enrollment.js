const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    course: {
        type: mongoose.Schema.ObjectId,
        ref: 'Course',
        required: true,
    },
    // 3. user can watch the course after buy the course
    // 5. admin dashboard to see who bought course
    isPaid: {
        type: Boolean,
        default: false,
    },
    // 6. use payment system with the help of razorpay
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String, // Populated after successful payment
    },
    amountPaid: { // 5. how much they paid for the course
        type: Number,
        required: true,
    },
    paidOn: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Ensures a user can only be enrolled in a course once
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true }); 

module.exports = mongoose.model('Enrollment', enrollmentSchema);