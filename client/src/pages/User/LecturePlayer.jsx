// src/pages/User/LecturePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { courses } from '../../api/api';

const LecturePlayer = () => {
    // These would typically come from the route state or parent component
    const { courseId, lectureId } = useParams(); 
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLecture = async () => {
            try {
                // 3. user can watch the course after buy the course
                const res = await courses.getLectureUrl(courseId, lectureId);
                setVideoUrl(res.data.data.lectureUrl);
                setLoading(false);
            } catch (err) {
                // Backend will return 403 Forbidden if user is not enrolled
                setError(err.response?.data?.message || "Access Denied. Please ensure you have purchased this course.");
                setLoading(false);
            }
        };
        fetchLecture();
    }, [courseId, lectureId]);

    if (loading) return <div className="p-4">Loading video stream...</div>;
    
    // Check if videoUrl is available and handle errors
    if (error || !videoUrl) return (
        <div className="p-6 text-red-700 bg-red-100 border border-red-300 rounded m-8">
            <h1 className="text-2xl font-bold mb-3">Playback Error</h1>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Lecture Playback</h1>
            
            {/* Responsive Video Player */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <video 
                    src={videoUrl} 
                    controls 
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg shadow-xl"
                />
            </div>
            
            <p className="mt-4 text-gray-700">Video source secured via Cloudinary and access verified on the backend.</p>
        </div>
    );
};

export default LecturePlayer;