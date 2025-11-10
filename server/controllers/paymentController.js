// controllers/paymentController.js

// const Razorpay = require('razorpay'); // You'll need to install 'razorpay'
const Razorpay = require("razorpay");

const Course = require("../model/Course.js");
const Enrollment = require("../model/Enrollment.js");
const User = require("../model/User.js");
const crypto = require("crypto");

// Built-in Node module

// Initialize Razorpay instance (use credentials from .env)
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order for a course
// @route   POST /api/v1/payment/create-order
// @access  Private (User)
const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found." });
    }

    // Amount must be in the smallest currency unit (e.g., paise for INR)
    const amount = course.price * 100;

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${userId}_${courseId}`,
    };

    // 6. use payment system with the help of razorpay
    const order = await razorpay.orders.create(options);

    // Create a temporary Enrollment record with the order ID
    await Enrollment.create({
      user: userId,
      course: courseId,
      razorpayOrderId: order.id,
      amountPaid: course.price,
      isPaid: false, // Will be set to true upon verification
    });

    res
      .status(201)
      .json({ success: true, orderId: order.id, amount: course.price });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Order creation failed",
        error: error.message,
      });
  }
};

// @desc    Verify Razorpay payment signature and confirm enrollment
// @route   POST /api/v1/payment/verify-payment
// @access  Private (User - called after successful Razorpay redirect)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    // Generate a signature using your secret and the payment/order IDs
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    // Check if the generated signature matches the signature received from Razorpay
    if (digest !== razorpay_signature) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Payment verification failed: Invalid Signature.",
        });
    }

    // Find and update the Enrollment record to confirm payment
    const enrollment = await Enrollment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        isPaid: true,
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true } // Return the updated document
    );

    if (!enrollment) {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment record not found." });
    }

    // Optional: Update User's enrolledCourses and Course's totalEnrollments
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { totalEnrollments: 1 },
    });
    await User.findByIdAndUpdate(enrollment.user, {
      $push: { enrolledCourses: enrollment._id },
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Payment verified and course unlocked!",
        enrollment,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
      });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
};
