// src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courses, payment, dashboard } from '../api/api'; // Check your import path
import { useAuth } from '../context/AuthContext';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper: Is the user an Admin?
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await courses.getDetails(courseId);
                setCourse(courseRes.data.data);
                
                // Only check enrollment if user is logged in AND NOT an admin
                if (user && !isAdmin) {
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
    }, [courseId, user, isAdmin]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (typeof window !== 'undefined' && window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleBuyCourse = async () => {
        // Admins should never need to run this function
        if (!course || !user || isAdmin) return;

        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) return;

        try {
            const orderRes = await payment.createOrder(courseId);
            const orderId = orderRes?.data?.orderId || orderRes?.data?.id;
            const amount = orderRes?.data?.amount;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: amount * 100,
                currency: "INR",
                name: "Course Platform",
                description: `Purchase: ${course.title}`,
                order_id: orderId,
                modal: { options: { upi_only: true } },
                handler: async function (response) {
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    const verifyRes = await payment.verifyPayment(verifyData);
                    if (verifyRes.data.success) {
                        alert("Purchase successful!");
                        setIsEnrolled(true);
                        navigate('/user/dashboard'); 
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#3B82F6" },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open(); 
        } catch (err) {
            alert("Payment initiation failed.");
        }
    };

    if (loading) return <div className="text-center p-12">Loading...</div>;
    if (error) return <div className="text-center p-12 text-red-600">{error}</div>;
    if (!course) return <div className="text-center p-12">Course not found.</div>;

    // Determine if the user (or admin) can view the content
    const canViewContent = isEnrolled || isAdmin;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-gray-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold">{course.title}</h1>
                    <p className="mt-2 text-lg text-gray-300 max-w-3xl">{course.description}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Left Column: Course Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                            <ul className="space-y-3">
                                {course.lectures && course.lectures.length > 0 ? (
                                    course.lectures.map((lecture, index) => (
                                        <li key={lecture._id} className="flex items-center p-3 bg-gray-50 rounded-md justify-between hover:bg-gray-100 transition">
                                            <div className="flex items-center">
                                                <span className="text-gray-500 font-mono mr-3">{index + 1}.</span>
                                                <span className="text-gray-800 font-medium">{lecture.title}</span>
                                            </div>
                                            
                                            {/* Access Logic for List Items */}
                                            {canViewContent ? (
                                                <Link 
                                                    to={`/course/${courseId}/watch?lectureId=${lecture._id}`}
                                                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm flex items-center"
                                                >
                                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                                    Play
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-semibold px-2 py-1 bg-gray-200 rounded-full flex items-center">
                                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                    Locked
                                                </span>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic">No lectures uploaded yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column: Sidebar / Action Card */}
                    <div className="mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24 border border-gray-100">
                            <h3 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                                ₹{course.price.toFixed(2)}
                            </h3>
                            
                            {/* --- BUTTON LOGIC --- */}
                            {isAdmin ? (
                                /* 1. ADMIN VIEW: Direct Access Button */
                                <div>
                                    <button
                                        onClick={() => navigate(`/course/${courseId}/watch`)}
                                        className="w-full px-6 py-3 text-lg font-bold rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition duration-300 shadow-lg flex justify-center items-center"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        Watch as Admin
                                    </button>
                                    <p className="text-center text-xs text-gray-500 mt-3">
                                        You have full preview access.
                                    </p>
                                </div>
                            ) : (
                                /* 2. USER VIEW: Buy or Go to Course */
                                <div>
                                    <button
                                        onClick={isEnrolled ? () => navigate(`/course/${courseId}/watch`) : handleBuyCourse}
                                        disabled={!user && !isEnrolled}
                                        className={`w-full px-6 py-3 text-lg font-bold rounded-lg transition duration-300 shadow-sm ${
                                            isEnrolled 
                                                ? 'bg-blue-600 text-white hover:bg-blue-700'  
                                                : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed'
                                        }`}
                                    >
                                        {isEnrolled ? "Go to Course" : "Buy Now"}
                                    </button>
                                    
                                    {!user && (
                                        <p className="text-xs text-center text-red-500 mt-3 font-medium">
                                            Log in to purchase.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;