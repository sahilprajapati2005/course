// routes/course.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Assuming you have a Course model for your database
const Course = require('../model/Course.js');


// ==> CHANGE 2: CONFIGURE MULTER STORAGE <==
const storage = multer.diskStorage({
  // The destination is where files are saved
  destination: function (req, file, cb) {
    // Save files into 'public/uploads/videos'. Make sure these folders exist.
    cb(null, 'public/uploads/videos');
  },
  // The filename is what the file will be called
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwriting
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });


// ==> CHANGE 3: APPLY MULTER TO YOUR POST ROUTE <==
// Let's assume your form uploads a single video file with name="courseVideo"
// The 'upload.single()' middleware will process the file before your controller logic runs.
router.post('/add-course', upload.single('courseVideo'), async (req, res) => {
  try {
    // The form's text fields are in req.body
    const { title, description } = req.body;

    // IMPORTANT: If no file is uploaded, req.file will be undefined.
    if (!req.file) {
      return res.status(400).send('No video file was uploaded.');
    }

    // ==> CHANGE 4: SAVE THE CORRECT URL PATH TO THE DATABASE <==
    // req.file.path from multer will be something like 'public/uploads/videos/file-123.mp4'.
    // We need to save the URL path, which is '/uploads/videos/file-123.mp4'.
    const videoUrl = `/uploads/videos/${req.file.filename}`;

    const newCourse = new Course({
      title,
      description,
      videoPath: videoUrl // Save the URL, not the full system path
    });

    await newCourse.save();
    res.redirect('/'); // Redirect to homepage or course page

  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// ... other routes (GET, etc.)
module.exports = router;