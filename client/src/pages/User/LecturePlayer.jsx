// client/src/pages/User/LecturePlayer.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { courses } from '../../api/api';
import { useAuth } from '../../context/AuthContext'; // Import Auth
import toast from 'react-hot-toast';
import { jsPDF } from "jspdf"; 

const LecturePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); // Get the logged-in user
    const query = new URLSearchParams(useLocation().search);
    const lectureId = query.get('lectureId');

    const [videoUrl, setVideoUrl] = useState('');
    const [lectureTitle, setLectureTitle] = useState('');
    const [courseTitle, setCourseTitle] = useState('');
    const [lectureError, setLectureError] = useState(null);
    const [courseLectures, setCourseLectures] = useState([]);
    
    // --- KEY FIX: Create a unique key for THIS user and THIS course ---
    // If user is null (loading), we use a safe fallback, but useEffect will update it
    const storageKey = user ? `completed_${user._id}_${courseId}` : null;

    // Initialize state
    const [completedLectures, setCompletedLectures] = useState([]);

    // Effect to load progress once user is available
    useEffect(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            setCompletedLectures(saved ? JSON.parse(saved) : []);
        }
    }, [storageKey]);

    const isCourseCompleted = courseLectures.length > 0 && completedLectures.length === courseLectures.length;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const courseRes = await courses.getDetails(courseId);
                setCourseLectures(courseRes.data.data.lectures || []);
                setCourseTitle(courseRes.data.data.title);
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

    const handleVideoEnded = () => {
        // Guard clause: if user isn't loaded or already completed, stop
        if (!storageKey || completedLectures.includes(lectureId)) return;

        const newCompletedList = [...completedLectures, lectureId];
        setCompletedLectures(newCompletedList);
        
        // --- FIX: Save to the USER-SPECIFIC key ---
        localStorage.setItem(storageKey, JSON.stringify(newCompletedList));

        toast.success("Lecture Completed! 🎉");
        
        if (newCompletedList.length === courseLectures.length) {
            toast.success("Course Completed! 🎓 Download your certificate below.", { duration: 5000 });
        }
    };

    const handleDownloadCertificate = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        const primaryColor = "#4F46E5"; 
        const secondaryColor = "#374151"; 

        doc.setLineWidth(2);
        doc.setDrawColor(primaryColor);
        doc.rect(10, 10, 277, 190);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(40);
        doc.setTextColor(primaryColor);
        doc.text("Certificate of Completion", 148.5, 50, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(secondaryColor);
        doc.text("This is to certify that", 148.5, 75, { align: "center" });

        doc.setFont("times", "bolditalic");
        doc.setFontSize(30);
        doc.setTextColor("#111827");
        doc.text(user?.name || "Student Name", 148.5, 95, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(80, 97, 217, 97);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(secondaryColor);
        doc.text("has successfully completed the course", 148.5, 115, { align: "center" });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(primaryColor);
        doc.text(courseTitle, 148.5, 130, { align: "center" });

        const date = new Date().toLocaleDateString();
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor("#6B7280");
        doc.text(`Date Issued: ${date}`, 148.5, 160, { align: "center" });
        doc.text("LearnSphere Official Certification", 148.5, 168, { align: "center" });

        doc.save(`${courseTitle}_Certificate.pdf`);
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

                {/* Right Column: Lecture List & Certificate */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    
                    {isCourseCompleted && (
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white text-center transform transition hover:scale-105">
                            <div className="mb-3 flex justify-center">
                                <span className="bg-white/20 p-3 rounded-full">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Congratulations! 🎉</h3>
                            <p className="text-indigo-100 text-sm mb-4">You have completed all lectures.</p>
                            <button 
                                onClick={handleDownloadCertificate}
                                className="w-full bg-white text-indigo-700 font-bold py-2 px-4 rounded-lg hover:bg-indigo-50 transition shadow-sm flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                Download Certificate
                            </button>
                        </div>
                    )}

                    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-800">Course Content</h2>
                            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-1 rounded">
                                {completedLectures.length} / {courseLectures.length}
                            </span>
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