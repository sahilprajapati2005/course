import React from 'react';

// This component expects a 'course' object as a prop
const CoursePlayer = ({ course }) => {
    
    // Your backend server's address
    const BACKEND_URL = 'http://localhost:5000';

    // Create the full, absolute URL for the video file
    const videoSrc = `${BACKEND_URL}${course.videoPath}`;

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            {/* FIX: Replaced fixed width with responsive classes */}
            <div className="w-full aspect-video bg-black rounded-lg shadow-lg overflow-hidden">
                <video className="w-full h-full object-contain" controls key={videoSrc}>
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
};

export default CoursePlayer;