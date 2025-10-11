// routes/userRoutes.js

const express = require('express');
const { getUserCourses, getAdminDashboardData } = require('../controllers/userController.js');
const { protect, authorize } = require('../middlewares/authMiddleware.js');

const router = express.Router();

// --- User Dashboard Route (Requires 'user' or 'admin') ---
// GET /api/v1/users/dashboard/my-courses
router.get(
    '/dashboard/my-courses', 
    protect, 
    authorize('user', 'admin'), 
    getUserCourses
);

// --- Admin Dashboard Route (Requires 'admin') ---
// GET /api/v1/users/dashboard/admin
router.get(
    '/dashboard/admin', 
    protect, 
    authorize('admin'), 
    getAdminDashboardData
);

module.exports = router;