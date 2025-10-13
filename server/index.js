// server.js (Conceptual outline)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const path = require('path');


 // Assume this file handles DB connection

// Load environment variables
dotenv.config();

// Process-level diagnostics to help catch silent exits
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
    // Optional: exit after logging to allow PM2 or other process managers to restart
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
    console.log('Process exiting with code:', code);
});

// Connect to database
connectDB();

const app = express();
app.use(express.static(path.join(__dirname, 'public')));


const allowedOrigins = [
    'http://localhost:5173', // Default port for Vite/React development
    'http://localhost:3000', // Default port for Create React App
    // Add your production frontend domain here later (e.g., 'https://www.yourdomain.com')
];

app.use(cors())


// Body parser
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes.js");
const courseRoutes = require("./routes/courseRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");
const userRoutes = require("./routes/userRoutes.js");

// Mount routers
// Standard API versioning practice (e.g., /api/v1)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
