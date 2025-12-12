// controllers/paymentController.js

const Razorpay = require("razorpay");
const Course = require("../model/Course.js");
const Enrollment = require("../model/Enrollment.js");
const User = require("../model/User.js");
const crypto = require("crypto");

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

    // 1. Check if already paid
    const existingPaidEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
      isPaid: true,
    });

    if (existingPaidEnrollment) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are already enrolled in this course.",
        });
    }

    // --- START OF FIX ---

    // 2. Find or Create the pending enrollment document FIRST
    const pendingEnrollment = await Enrollment.findOneAndUpdate(
      {
        user: userId,
        course: courseId,
        isPaid: false,
      },
      {
        $set: {
          amountPaid: course.price, // Set/update the price
        },
      },
      {
        upsert: true, // If no doc matches, create it
        new: true, // Return the new/updated doc
        setDefaultsOnInsert: true,
      }
    );

    // 3. Create Razorpay options USING the enrollment's unique _id
    const amount = course.price * 100;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: pendingEnrollment._id.toString(), // <-- FIX: This is 24 chars
    };

    // 4. Create the order with Razorpay
    const order = await razorpay.orders.create(options);

    // 5. Update the pending enrollment with the new razorpayOrderId
    pendingEnrollment.razorpayOrderId = order.id;
    await pendingEnrollment.save();

    // --- END OF FIX ---

    // 6. Send response
    res
      .status(201)
      .json({ success: true, orderId: order.id, amount: course.price });
  } catch (error) {
    console.error("Order creation failed:", error); // Log the real error
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
    });
  }
};

// ... (Your verifyPayment function is correct, no changes needed) ...

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
      return res.status(400).json({
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
        .status(440) // Using a different status to see if it's this error
        .json({
          success: false,
          message: "Enrollment record not found for this Order ID.",
        });
    }

    // Optional: Update User's enrolledCourses and Course's totalEnrollments
    await Course.findByIdAndUpdate(enrollment.course, {
      $inc: { totalEnrollments: 1 },
    });
    await User.findByIdAndUpdate(enrollment.user, {
      $push: { enrolledCourses: enrollment._id },
    });

    res.status(200).json({
      success: true,
      message: "Payment verified and course unlocked!",
      enrollment,
    });
  } catch (error) {
    console.error("Payment verification failed:", error); // Log the real error
    res.status(500).json({
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
