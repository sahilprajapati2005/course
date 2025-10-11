// routes/authRoutes.js

const express = require('express');
const { register, login } = require('../controllers/authController.js');

const router = express.Router();

// Public routes for user authentication
router.post('/register', register); // POST /api/v1/auth/register
router.post('/login', login);       // POST /api/v1/auth/login

module.exports = router;