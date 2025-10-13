import React from 'react';

// This component expects a 'course' object as a prop
// The object should look like: { title: '...', description: '...', videoPath: '/uploads/videos/video-12345.mp4' }
const CoursePlayer = ({ course }) => {
    
    // Your backend server's address
    const BACKEND_URL = 'http://localhost:5000';

    // **This is the key step:** Create the full, absolute URL for the video file
    const videoSrc = `${BACKEND_URL}${course.videoPath}`;

    return (
        <div>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            
            <video width="720" controls key={videoSrc}>
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default CoursePlayer;