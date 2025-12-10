// client/src/pages/User/LecturePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { courses, dashboard } from '../../api/api';
import toast from 'react-hot-toast'; // <--- IMPORT THIS

const LecturePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const lectureId = query.get('lectureId');

    const [videoUrl, setVideoUrl] = useState('');
    const [lectureTitle, setLectureTitle] = useState('');
    const [lectureError, setLectureError] = useState(null);
    const [courseLectures, setCourseLectures] = useState([]);
    const [completedLectures, setCompletedLectures] = useState([]); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await courses.getDetails(courseId);
                setCourseLectures(courseRes.data.data.lectures || []);

                const progressRes = await dashboard.getCourseProgress(courseId);
                setCompletedLectures(progressRes.data.completedLectures || []);
            } catch (err) {
                console.error("Failed to load course data:", err);
            }
        };
        fetchData();
    }, [courseId]);

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

    const handleVideoEnded = async () => {
        try {
            await dashboard.markLectureComplete(courseId, lectureId);
            
            // Only show toast if it wasn't already completed
            if (!completedLectures.includes(lectureId)) {
                setCompletedLectures((prev) => [...prev, lectureId]);
                // --- SHOW TOAST MESSAGE ---
                toast.success("Lecture Completed! 🎉", {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                });
            }
        } catch (err) {
            console.error("Failed to mark lecture as complete:", err);
            toast.error("Failed to update progress.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                
                {/* Left Column: Video Player */}
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
                                        onEnded={handleVideoEnded} 
                                    />
                                )}
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <h1 className="text-2xl font-bold text-gray-900">{lectureTitle}</h1>
                                {completedLectures.includes(lectureId) && (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        Completed
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Right Column: Lecture List */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                {completedLectures.length} / {courseLectures.length} Completed
                            </p>
                        </div>
                        
                        <div className="h-fit max-h-[600px] overflow-y-auto p-2">
                            {courseLectures.length === 0 ? (
                                <p className="text-gray-500 p-4 text-center">No lectures available.</p>
                            ) : (
                                <ul className="space-y-1">
                                    {courseLectures.map((lec, index) => {
                                        const isActive = lec._id === lectureId;
                                        const isCompleted = completedLectures.includes(lec._id);

                                        return (
                                            <li 
                                                key={lec._id}
                                                onClick={() => handleLectureClick(lec._id)}
                                                className={`p-3 rounded-md cursor-pointer transition flex items-center justify-between text-sm ${
                                                    isActive 
                                                        ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-semibold' 
                                                        : 'hover:bg-gray-100 text-gray-700'
                                                }`}
                                            >
                                                <div className="flex items-center overflow-hidden">
                                                    <span className={`mr-3 font-mono w-6 text-right ${isCompleted ? 'text-green-500' : 'text-gray-400'}`}>
                                                        {isCompleted ? (
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                        ) : (
                                                            `${index + 1}.`
                                                        )}
                                                    </span>
                                                    <span className="line-clamp-2">{lec.title}</span>
                                                </div>
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