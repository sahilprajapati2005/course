// routes/paymentRoutes.js

const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// POST /api/v1/payment/create-order (Requires user login and courseId in body)
router.post('/create-order', protect, createOrder);

// POST /api/v1/payment/verify-payment (Called by client after Razorpay success)
router.post('/verify-payment', protect, verifyPayment);

module.exports = router;