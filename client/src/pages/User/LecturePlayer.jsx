// src/pages/User/LecturePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { courses } from '../../api/api';

const LecturePlayer = () => {
    // A hook to easily get query params
    const useQuery = () => new URLSearchParams(useLocation().search);
    
    const { courseId } = useParams();
    const query = useQuery();
    const lectureId = query.get('lectureId'); // Get lectureId from URL query

    const [videoUrl, setVideoUrl] = useState('');
    const [lectureTitle, setLectureTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lectureId) {
            setError("No lecture selected.");
            setLoading(false);
            return;
        }

        const fetchLecture = async () => {
            try {
                const res = await courses.getLectureUrl(courseId, lectureId);
                setVideoUrl(res.data.data.videoUrl);
                setLectureTitle(res.data.data.title);
            } catch (err) {
                setError(err.response?.data?.message || "Could not load lecture.");
            } finally {
                setLoading(false);
            }
        };

        fetchLecture();
    }, [courseId, lectureId]);

    if (loading) return <div className="text-center p-8">Loading Lecture...</div>;
    
    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                {/* Video Player */}
                <div className="lg:col-span-2">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{lectureTitle || 'Lecture'}</h1>
                    {error || !videoUrl ? (
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center rounded-lg">
                            <p className="text-red-600">{error || "Video could not be loaded."}</p>
                        </div>
                    ) : (
                        <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-xl overflow-hidden">
                            <video src={videoUrl} controls autoPlay className="w-full h-full" />
                        </div>
                    )}
                </div>

                {/* Lecture List (Placeholder) */}
                <div className="mt-8 lg:mt-0 lg:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Course Lectures</h2>
                        <ul className="space-y-2">
                           {/* In a real app, you would fetch all lectures for the course and list them here */}
                           <li className="p-2 rounded-md bg-gray-100 text-gray-700">Lecture 1</li>
                           <li className="p-2 rounded-md hover:bg-gray-100 text-gray-500">Lecture 2</li>
                           <li className="p-2 rounded-md hover:bg-gray-100 text-gray-500">Lecture 3</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturePlayer;