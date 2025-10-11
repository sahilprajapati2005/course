// controllers/authController.js
const User = require('../model/User.js'); // User model
const bcrypt = require('bcryptjs');

 // You'll need to install 'bcryptjs'
const jwt = require('jsonwebtoken'); // You'll need to install 'jsonwebtoken'

// Utility function to generate JWT (put your secret in .env)
const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user. Role is 'user' by default from the model.
        // NOTE: Admin creation should generally be manual or through a secure, protected route.
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user', // Allows assigning admin role during setup (secure this later!)
        });
        
        // Generate JWT and send response
        const token = signToken(user._id);
        res.status(201).json({
            success: true,
            token,
            data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
 const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Find user and select password (since 'select: false' in model)
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
             return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT and send response
        const token = signToken(user._id);
        res.status(200).json({
            success: true,
            token,
            data: { user: { _id: user._id, name: user.name, email: user.email, role: user.role } },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
    }
};

module.exports = {
    register,
    login,
};