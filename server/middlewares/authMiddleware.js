// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../model/User.js');

// --- 1. Protect Function: Checks for Token and Validates User ---
// This function ensures a user is logged in before accessing a route.
const protect = async (req, res, next) => {
    let token;

    // 1. Get token from header (Format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Find user by ID and attach to request (req.user)
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'The user belonging to this token no longer exists' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT Error:', error.message);
        return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
};

// --- 2. Authorize Function: Checks User Role ---
// This function restricts access based on a specific role (e.g., 'admin').
const authorize = (...roles) => {
    return (req, res, next) => {
        // Check if the user's role is included in the allowed roles array
        if (!roles.includes(req.user.role)) {
            // 1. Role-based authentication check
            return res.status(403).json({ 
                success: false, 
                message: `User role (${req.user.role}) is not authorized to access this route.` 
            });
        }
        next();
    };
};
module.exports = { protect, authorize };
