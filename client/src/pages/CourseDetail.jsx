// src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courses, payment, dashboard } from './src/api/api.js';
import { useAuth } from './src/context/AuthContext.jsx';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- Check Enrollment (User) & Fetch Data ---
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await courses.getDetails(courseId);
                setCourse(courseRes.data.data);
                
                // Check if user is enrolled
                if (user && user.role !== 'admin') { // Admins don't need to check DB for enrollment
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

    // --- Razorpay Script Loader ---
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

    // --- Handle Buy ---
    const handleBuyCourse = async () => {
        if (!course || !user) return;
        
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

    // --- FIX 1: Admin Bypass Logic ---
    // If the user is an Admin, they can access the course immediately.
    const canAccessCourse = isEnrolled || (user && user.role === 'admin');

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
                    {/* Left Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
                            <ul className="space-y-3">
                                {course.lectures && course.lectures.length > 0 ? (
                                    course.lectures.map((lecture) => (
                                        <li key={lecture._id} className="flex items-center p-3 bg-gray-50 rounded-md justify-between">
                                            <span className="text-gray-800 ml-3">{lecture.title}</span>
                                            {/* Show Watch link immediately if Admin/Enrolled */}
                                            {canAccessCourse && (
                                                <span className="text-xs text-green-600 font-bold px-2 py-1 bg-green-100 rounded">Unlocked</span>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500">No lectures available.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="mt-8 lg:mt-0">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                            <h3 className="text-3xl font-extrabold text-gray-900 text-center">
                                ₹{course.price.toFixed(2)}
                            </h3>
                            <div className="mt-6">
                                <button
                                    onClick={canAccessCourse ? () => navigate(`/course/${courseId}/watch`) : handleBuyCourse}
                                    disabled={!user && !canAccessCourse}
                                    className={`w-full px-6 py-3 text-lg font-bold rounded-lg transition duration-300 ${
                                        canAccessCourse 
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'  
                                            : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'
                                    }`}
                                >
                                    {canAccessCourse ? "Go to Course" : "Buy Now"}
                                </button>
                            </div>
                            {!user && <p className="text-xs text-center text-red-600 mt-2">Please log in to purchase.</p>}
                            {/* Visual cue for Admins */}
                            {user?.role === 'admin' && <p className="text-xs text-center text-indigo-600 mt-2 font-semibold">Admin Access Enabled</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;