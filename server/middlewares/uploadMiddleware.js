// server/middlewares/uploadMiddleware.js
const multer = require('multer');

// Use Memory Storage (Keeps file in RAM as a Buffer)
const storage = multer.memoryStorage();

// File Filter (Same as before)
const videoFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('video/') || 
        file.mimetype === 'application/octet-stream' ||
        file.originalname.match(/\.(mp4|mov|avi|wmv|flv|mkv)$/i)) {
        cb(null, true);
    } else {
        cb(new Error('Only video files (mp4, mov, etc.) are allowed!'), false);
    }
};

// Initialize Multer
const upload = multer({ 
    storage: storage,
    fileFilter: videoFilter,
    limits: { 
        fileSize: 1024 * 1024 * 500 // 500MB limit
    } 
}).single('video');

// Export Middleware
exports.uploadVideo = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: `Upload Failed: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ success: false, message: `Upload Failed: ${err.message}` });
        }
        
        // Ensure a file was actually uploaded
        if (!req.file) {
             return res.status(400).json({ success: false, message: 'No video file provided.' });
        }
        
        next();
    });
};