// src/pages/User/LecturePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { courses } from '../../api/api';

const LecturePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const lectureId = query.get('lectureId');

    const [videoUrl, setVideoUrl] = useState('');
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureError, setLectureError] = useState(null);
    const [courseLectures, setCourseLectures] = useState([]);
    
    // Fetch Course List
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const res = await courses.getDetails(courseId);
                setCourseLectures(res.data.data.lectures || []);
            } catch (err) {
                console.error("Failed to load course list:", err);
            }
        };
        fetchCourseDetails();
    }, [courseId]);

    // Fetch Video URL
    useEffect(() => {
        if (!lectureId) return;
        const fetchLecture = async () => {
            setLectureError(null);
            try {
                const res = await courses.getLectureUrl(courseId, lectureId);
                setVideoUrl(res.data.data.videoUrl);
                setLectureTitle(res.data.data.title);
            } catch (err) {
                setLectureError(err.response?.data?.message || "Could not load lecture.");
            }
        };
        fetchLecture();
    }, [courseId, lectureId]);

    const handleLectureClick = (id) => {
        navigate(`/course/${courseId}/watch?lectureId=${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                
                {/* --- Left Column: Video Player --- */}
                <div className="lg:col-span-2 mb-8 lg:mb-0">
                    {!lectureId ? (
                        <div className="w-full aspect-video bg-gray-200 flex flex-col items-center justify-center rounded-lg shadow-inner">
                            <p className="text-gray-500 text-lg font-medium">Select a lecture to start watching</p>
                        </div>
                    ) : (
                        <>
                            <div className="w-full aspect-video bg-black rounded-lg shadow-xl overflow-hidden relative">
                                {lectureError ? (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-red-500">
                                        {lectureError}
                                    </div>
                                ) : (
                                    <video 
                                        key={videoUrl} 
                                        src={videoUrl} 
                                        controls 
                                        autoPlay 
                                        className="w-full h-full object-contain" 
                                    />
                                )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mt-4">{lectureTitle}</h1>
                        </>
                    )}
                </div>

                {/* --- Right Column: Lecture List --- */}
                {/* FIX 2: Changed fixed height to adaptive height with max limit */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
                        </div>
                        
                        {/* h-fit: Height fits the content (shrinks if few items)
                           max-h-[600px]: Stops growing after 600px
                           overflow-y-auto: Adds scrollbar if content exceeds max-height
                        */}
                        <div className="h-fit max-h-[600px] overflow-y-auto p-2">
                            {courseLectures.length === 0 ? (
                                <p className="text-gray-500 p-4 text-center">No lectures available.</p>
                            ) : (
                                <ul className="space-y-1">
                                    {courseLectures.map((lec, index) => {
                                        const isActive = lec._id === lectureId;
                                        return (
                                            <li 
                                                key={lec._id}
                                                onClick={() => handleLectureClick(lec._id)}
                                                className={`p-3 rounded-md cursor-pointer transition flex items-center text-sm ${
                                                    isActive 
                                                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-semibold' 
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <span className="mr-3 text-gray-400 font-mono w-6 text-right">
                                                    {index + 1}.
                                                </span>
                                                <span className="line-clamp-2">{lec.title}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LecturePlayer;