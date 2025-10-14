// routes/courseRoutes.js
const express = require('express');

const { addCourse, addLecture, getLecture, searchCourses, getCourseDetails } = require('../controllers/courseController.js');
const { protect, authorize } = require('../middlewares/authMiddleware.js');
const { uploadVideo } = require('../middlewares/uploadMiddleware.js');   

const router = express.Router();

// --- Public Routes ---
// GET /api/v1/courses/search?q=mern
router.get('/search', searchCourses); 

// --- Admin Protected Routes (Requires 'admin' role) ---
// POST /api/v1/courses (Requires a body with title, description, price)
router.post('/', protect, authorize('admin'), addCourse); 

// POST /api/v1/courses/:courseId/lectures 
// Requires auth, authorization, file upload middleware, and then controller logic
router.post(
    '/:courseId/lectures', 
    protect, 
    authorize('admin'), 
    uploadVideo, // Multer middleware
    addLecture
);

// --- User Protected Routes (Requires 'user' or 'admin' role) ---
// GET /api/v1/courses/:courseId/lectures/:lectureId
// User must be enrolled to access the controller logic
router.get(
    '/:courseId/lectures/:lectureId', 
    protect, 
    authorize('user', 'admin'), 
    getLecture
);

router.get('/:courseId', getCourseDetails); 


module.exports = router;