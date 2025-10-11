// controllers/userController.js
const Enrollment = require('../model/Enrollment.js'); // Enrollment model


// ----------------------------------------------------------------------
// USER DASHBOARD FUNCTIONALITY (Requirement 4)
// ----------------------------------------------------------------------

// @desc    Get all courses purchased by the user
// @route   GET /api/v1/users/dashboard/my-courses
// @access  Private (User)
const getUserCourses = async (req, res) => {
    try {
        // 4. user dashboard so he can see how much course he and she buy
        const enrollments = await Enrollment.find({ 
            user: req.user.id, 
            isPaid: true 
        })
        .populate('course', 'title description price'); // Pull course details
        
        res.status(200).json({ 
            success: true, 
            count: enrollments.length,
            data: enrollments.map(e => e.course) 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch user courses', error: error.message });
    }
};

// ----------------------------------------------------------------------
// ADMIN DASHBOARD FUNCTIONALITY (Requirement 5)
// ----------------------------------------------------------------------

// @desc    Get all sales data for the admin dashboard
// @route   GET /api/v1/users/dashboard/admin
// @access  Private (Admin)
const getAdminDashboardData = async (req, res) => {
    try {
        // 5. admin dashboard because he can see which user buy course and how many they buy and how much they paid
        const salesData = await Enrollment.find({ isPaid: true })
            .populate('user', 'name email')
            .populate('course', 'title price');

        // Calculate total revenue
        const totalRevenue = salesData.reduce((sum, enrollment) => sum + enrollment.amountPaid, 0);

        // Calculate total enrollments
        const totalEnrollments = salesData.length;

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalEnrollments,
                sales: salesData.map(sale => ({
                    user: sale.user.name,
                    userEmail: sale.user.email,
                    courseTitle: sale.course.title,
                    amountPaid: sale.amountPaid,
                    paidOn: sale.paidOn,
                    razorpayPaymentId: sale.razorpayPaymentId,
                })),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch admin dashboard data', error: error.message });
    }
};

module.exports = {
    getUserCourses,
    getAdminDashboardData,
};