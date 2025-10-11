// utils/cloudinary.js
 // Import Cloudinary v2
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

 // Node's built-in file system module

// --- 1. Initialize Cloudinary Configuration ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// --- 2. Create a Wrapper for Upload and Cleanup ---
exports.uploader = {
    /**
     * Uploads a file to Cloudinary and deletes the temporary local file.
     * @param {string} filePath - The path where Multer saved the file (req.file.path).
     * @param {object} options - Cloudinary upload options.
     */
    upload: async (filePath, options) => {
        let result;
        try {
            // Upload the file to Cloudinary
            result = await cloudinary.uploader.upload(filePath, options);
            return result;
        } catch (error) {
            // Throw error to be caught by the calling controller
            throw new Error(`Cloudinary upload failed: ${error.message}`);
        } finally {
            // !!! CRITICAL STEP: CLEAN UP THE LOCALLY SAVED FILE !!!
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Delete the temporary file
                // console.log(`Successfully deleted local file: ${filePath}`);
            }
        }
    },
    
    // Deletion wrapper (e.g., if Admin wants to delete a lecture)
    destroy: async (publicId, options) => {
        return cloudinary.uploader.destroy(publicId, options);
    }
};

// Export the configured cloudinary object itself if needed
exports.cloudinary = cloudinary;