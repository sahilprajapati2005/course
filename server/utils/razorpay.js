// utils/razorpay.js

const Razorpay = require('razorpay');

// --- 1. Initialize Razorpay Client ---
// Creates a new Razorpay instance using environment variables.
// This client object will be used to interact with the Razorpay APIs 
// (e.g., creating orders, fetching payments).
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,         // Your Razorpay Key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your Razorpay Key Secret
});

// --- 2. Export the Initialized Client ---
// Exporting the instance allows the paymentController to use it 
// without needing to redefine the configuration.
module.exports = razorpay;