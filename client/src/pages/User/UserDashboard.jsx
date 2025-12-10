// src/pages/User/UserDashboard.jsx
import React, { useState, useEffect } from 'react';
import { dashboard } from '../../api/api';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [purchasedCourses, setPurchasedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await dashboard.getUserCourses();
                const list = res?.data?.data ?? res?.data ?? [];
                setPurchasedCourses(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error('Failed to fetch user courses:', err);
                setError("Failed to fetch courses. Please log in again.");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    // --- Loading State ---
    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading your learning space...</p>
            </div>
        </div>
    );

    // --- Error State ---
    if (error) return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <Link to="/login" className="inline-block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors">
                    Back to Login
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* --- Header Section --- */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-12 px-4 sm:px-6 lg:px-8 shadow-lg">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">My Learning</h1>
                    <p className="text-indigo-200 text-lg max-w-2xl">
                        Welcome back! Track your progress and continue mastering new skills.
                    </p>
                </div>
            </div>

            {/* --- Content Section --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
                {purchasedCourses.length === 0 ? (
                    // Empty State
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100 max-w-2xl mx-auto">
                        <div className="inline-flex items-center justify-center p-6 rounded-full bg-indigo-50 mb-6">
                            <svg className="w-16 h-16 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses enrolled yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't purchased any courses. Explore our catalog to find your next skill.</p>
                        <Link 
                            to="/" 
                            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-105 transition-transform duration-300"
                        >
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    // Course Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {purchasedCourses.map((course) => (
                            <div key={course._id} className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group transform hover:-translate-y-1">
                                {/* Decorative Gradient Thumbnail */}
                                <div className="h-36 bg-gradient-to-br from-indigo-500 to-purple-600 relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                    {/* Decorative circles */}
                                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/10 rounded-full"></div>
                                    
                                    {/* Icon in center */}
                                    <svg className="w-12 h-12 text-white/90 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {course.title}
                                        </h2>
                                        <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">
                                            {course.description || 'No description available for this course.'}
                                        </p>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 border-t border-gray-50">
                                        <Link 
                                            to={`/course/${course._id}/watch`} 
                                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                            </svg>
                                            Continue Learning
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;