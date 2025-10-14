// controllers/courseController.js (Focusing only on the addLecture function for revision)

// ... (Requires: const Course, Lecture, Enrollment, and cloudinary utility imports)

// @desc    Admin uploads a video lecture to a course
// @route   POST /api/v1/courses/:courseId/lectures
// @access  Private (Admin)
const Course = require('../model/Course.js');
const Lecture = require('../model/Lecture.js');
const Enrollment = require('../model/Enrollment.js');
 // Enrollment model
const cloudinary = require('../utils/cloudinary.js'); // Cloudinary utility

// const addLecture = async (req, res) => {
//     const { courseId } = req.params;
//     const { title, description, order } = req.body;
    
//     // Multer ensures req.file exists and is valid at this point
//     const filePath = req.file.path; // This is the path to the temporary file

//     try {
//         // 8. Admin upload videos lecture that store in a cloudinary.
//         // The uploader utility handles the Cloudinary upload AND the local file cleanup.
//         const result = await cloudinary.uploader.upload(filePath, {
//             folder: 'course-videos', // Organized folder in Cloudinary
//             resource_type: 'video',  // Essential for video processing
//         });

//         // 2. Create the Lecture model entry
//         const newLecture = await Lecture.create({
//             title,
//             description,
//             order: order || 1,
//             course: courseId,
//             videoUrl: result.secure_url,
//             cloudinaryPublicId: result.public_id,
//         });

//         // 3. Update the Course model
//         await Course.findByIdAndUpdate(courseId, {
//             $push: { lectures: newLecture._id }
//         });

//         res.status(201).json({ success: true, message: 'Lecture uploaded and saved successfully', data: newLecture });

//     } catch (error) {
//         // Handle Cloudinary/DB errors
//         console.error('Lecture Upload Failed:', error);
//         res.status(500).json({ success: false, message: 'Failed to upload or save lecture data.', error: error.message });
//     }
// };



const addLecture = async (req, res) => {
    const { courseId } = req.params;
    const { title, description, order } = req.body;
    
    const filePath = req.file.path;

    try {
        // 1. Upload to Cloudinary (this will no longer delete the local file)
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'course-videos',
            resource_type: 'video',
        });

        // 2. CONSTRUCT THE LOCAL URL PATH
        // req.file.filename gives you just the file name (e.g., "video-12345.mp4")
        // We build the public URL that can be accessed from the browser.
        const localVideoUrl = `/uploads/videos/${req.file.filename}`;

        // 3. Create the Lecture model entry with BOTH URLs
        const newLecture = await Lecture.create({
            title,
            description,
            order: order || 1,
            course: courseId,
            videoUrl: result.secure_url, // Cloudinary URL
            localVideoPath: localVideoUrl, // Local Server URL
            cloudinaryPublicId: result.public_id,
        });

        // 4. Update the Course model
        await Course.findByIdAndUpdate(courseId, {
            $push: { lectures: newLecture._id }
        });

        res.status(201).json({ success: true, message: 'Lecture uploaded and saved successfully', data: newLecture });

    } catch (error) {
        console.error('Lecture Upload Failed:', error);
        res.status(500).json({ success: false, message: 'Failed to upload or save lecture data.', error: error.message });
    }
};

// --- Add Course (Admin) ---


// const addCourse = async (req, res) => {
//     try {
//         const { title, description, price } = req.body;
//         const course = await Course.create({ title, description, price });
//         res.status(201).json({ success: true, data: course });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
//     }
// };

const addCourse = async (req, res) => {
    try {
        // The JWT middleware must run before this function to populate req.user
        const instructorId = req.user.id; 
        
        const { title, description, price } = req.body;
        
        // 🌟 FIX: Include instructor: instructorId in the create payload 🌟
        const course = await Course.create({ 
            title, 
            description, 
            price, 
            instructor: instructorId 
        });
        
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        // It's good practice to log the actual error for debugging
        console.error("Course creation error:", error); 
        res.status(500).json({ success: false, message: 'Failed to create course', error: error.message });
    }
};

// --- Get Lecture (User must be enrolled - check simplified) ---
const getLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId);
        if (!lecture || String(lecture.course) !== String(courseId)) {
            return res.status(404).json({ success: false, message: 'Lecture not found for this course' });
        }
        res.status(200).json({ success: true, data: lecture });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch lecture', error: error.message });
    }
};

// --- Search Courses ---
const searchCourses = async (req, res) => {
    try {
        const q = req.query.q || '';
        const courses = await Course.find({ title: { $regex: q, $options: 'i' } }).limit(20);
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Search failed', error: error.message });
    }
};

const getCourseDetails = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId).populate('lectures', 'title _id');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch course details', error: error.message });
    }
};


module.exports = {
    addLecture,
    addCourse,
    getLecture,
    searchCourses,
    getCourseDetails
};