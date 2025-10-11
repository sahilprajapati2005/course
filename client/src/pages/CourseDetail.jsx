// CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courses, payment, dashboard } from './src/api/api.js';
import { useAuth } from './src/context/AuthContext.jsx'; // Corrected path

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ... (useEffect, loadRazorpayScript, and handleBuyCourse functions remain the same) ...

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await courses.getDetails(courseId);
                setCourse(courseRes.data.data);
                if (user) {
                    const dashboardRes = await dashboard.getUserCourses();
                    setIsEnrolled(dashboardRes.data.data.some(c => c._id === courseId));
                }
            } catch (err) {
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, user]);


    if (loading) return <div className="text-center p-12">Loading...</div>;
    if (error) return <div className="text-center p-12 text-red-600">{error}</div>;
    if (!course) return <div className="text-center p-12">Course not found.</div>;

    return (
        <div className="bg-gray-50">
            {/* Top Banner */}
            <div className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold">{course.title}</h1>
                    <p className="mt-2 text-lg text-gray-300 max-w-3xl">{course.description}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Left Column (Course Content) */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you'll learn</h2>
                            <ul className="space-y-3">
                                {course.lectures && course.lectures.length > 0 ? (
                                    course.lectures.map((lecture, index) => (
                                        <li key={lecture._id} className="flex items-center p-3 bg-gray-50 rounded-md">
                                            <span className="text-gray-800 ml-3">{lecture.title}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No lectures have been added to this course yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column (Purchase Card) */}
                    <div className="mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <h3 className="text-3xl font-extrabold text-gray-900 text-center">
                                ₹{course.price.toFixed(2)}
                            </h3>
                            <div className="mt-6">
                                <button
                                    onClick={isEnrolled ? () => navigate(`/course/${courseId}/watch`) : handleBuyCourse}
                                    disabled={!user && !isEnrolled}
                                    className={`w-full px-6 py-3 text-lg font-bold rounded-lg transition duration-300 ${
                                        isEnrolled 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                    }`}
                                >
                                    {isEnrolled ? "Go to Course" : "Buy Now"}
                                </button>
                            </div>
                            {!user && <p className="text-xs text-center text-red-600 mt-2">Please log in to purchase.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;