// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Import File System for guaranteed cleanup if Multer fails

// Define the temporary storage destination
const UPLOAD_DIR = path.join(__dirname, '../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// --- 1. Define Storage Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set the destination folder for temporary storage
        cb(null, UPLOAD_DIR); 
    },
    filename: (req, file, cb) => {
        // Use fieldname, date, and original extension to create a unique name
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${ext}`);
    },
});

// --- 2. Define File Filter ---
const videoFilter = (req, file, cb) => {
    // Allows video mimetypes and common video container types
    if (file.mimetype.startsWith('video/') || 
        file.mimetype === 'application/octet-stream' ||
        file.originalname.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i)) {
        cb(null, true);
    } else {
        cb(new Error('Only video files (mp4, mov, etc.) are allowed!'), false);
    }
};

// --- 3. Initialize Multer Upload Instance ---
const upload = multer({ 
    storage: storage,
    fileFilter: videoFilter,
    limits: { 
        fileSize: 1024 * 1024 * 500 // 500MB limit
    } 
}).single('video'); // 'video' must match the field name in the client form data

// --- 4. Export a Wrapper Function for Error Handling ---
exports.uploadVideo = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // Specific Multer errors (e.g., file too large)
            return res.status(400).json({ success: false, message: `Upload Failed (Multer): ${err.message}` });
        } else if (err) {
            // General errors (e.g., failed file filter)
            return res.status(400).json({ success: false, message: `Upload Failed: ${err.message}` });
        }
        
        // Ensure a file was actually uploaded before proceeding
        if (!req.file) {
             return res.status(400).json({ success: false, message: 'No video file provided.' });
        }
        
        next();
    });
};