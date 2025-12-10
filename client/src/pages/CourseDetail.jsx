// client/src/pages/CourseDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { courses, payment, dashboard } from '../api/api.js'; // Corrected relative path
import { useAuth } from '../context/AuthContext.jsx'; // Corrected relative path

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user, isAdmin: contextIsAdmin } = useAuth();
    
    // Fallback/direct check for admin status
    const isAdmin = contextIsAdmin || user?.role === 'admin';

    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                theme: { color: "#4F46E5" }, 
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open(); 
        } catch (err) {
            alert("Payment initiation failed.");
        }
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const courseRes = await courses.getDetails(courseId);
                setCourse(courseRes.data.data);
                
                if (user) {
                    if (isAdmin) {
                        setIsEnrolled(true);
                    } else {
                        const dashboardRes = await dashboard.getUserCourses();
                        setIsEnrolled(dashboardRes.data.data.some(c => c._id === courseId));
                    }
                }
            } catch (err) {
                setError('Failed to load course details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, user, isAdmin]);


    if (loading) return <div className="flex justify-center items-center h-screen text-indigo-600 font-semibold">Loading Course...</div>;
    if (error) return <div className="text-center p-12 text-red-600 font-bold">{error}</div>;
    if (!course) return <div className="text-center p-12 text-gray-500">Course not found.</div>;

    const hasAccess = isEnrolled || isAdmin;

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            {/* --- HERO HEADER: Responsive Padding & Typography --- */}
            <div className="bg-gray-900 text-white py-12 sm:py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-gray-900 opacity-90"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <span className="text-indigo-400 font-bold tracking-wider uppercase text-xs sm:text-sm">Online Course</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mt-2 leading-tight">{course.title}</h1>
                    <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-300 max-w-3xl leading-relaxed">{course.description}</p>
                    <div className="mt-6 flex items-center space-x-4 text-xs sm:text-sm text-gray-400">
                        <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg> {course.lectures?.length || 0} Lectures</span>
                        <span>•</span>
                        <span>English</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Responsive Grid: Single column on small, two columns on large */}
                <div className="lg:grid lg:grid-cols-3 lg:gap-12">
                    
                    {/* --- RIGHT COLUMN: PURCHASE CARD (MOVED UP ON MOBILE) --- */}
                    <div className="order-first lg:order-last lg:mt-0 mb-8">
                        <div className="bg-white rounded-2xl shadow-xl lg:sticky lg:top-24 overflow-hidden border border-gray-100 transform transition-all hover:shadow-2xl">
                            {/* Card Header Gradient */}
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            
                            <div className="p-6 sm:p-8">
                                <div className="mb-6 text-center">
                                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Price</span>
                                    <div className="flex items-center justify-center text-4xl sm:text-5xl font-extrabold text-gray-900 mt-2">
                                        <span className="text-xl sm:text-2xl mt-1 mr-1">₹</span>
                                        {course.price.toFixed(2)}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {isAdmin ? (
                                        <button
                                            onClick={() => navigate(`/course/${courseId}/watch`)}
                                            className="w-full py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl bg-gray-800 text-white hover:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                                        >
                                            <span>Admin Access</span>
                                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={isEnrolled ? () => navigate(`/course/${courseId}/watch`) : handleBuyCourse}
                                            disabled={!user}
                                            className={`w-full py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center transform hover:-translate-y-0.5 ${
                                                isEnrolled 
                                                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-green-500/30' 
                                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-500/30 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none'
                                            }`}
                                        >
                                            {isEnrolled ? "Go to Course" : "Buy Now"}
                                        </button>
                                    )}
                                    
                                    {!user && !isAdmin && (
                                        <p className="text-xs text-center text-red-500 mt-2 font-medium">
                                            Please log in to purchase this course.
                                        </p>
                                    )}
                                </div>

                                {/* Features List */}
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Course Benefits:</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="font-medium">Lifetime Access</span> to all lessons.
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Access on Mobile, Tablet & Desktop.
                                        </li>
                                        <li className="flex items-center text-sm text-gray-600">
                                            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            Official Certificate of Completion.
                                        </li>
                                    </ul>
                                </div>

                                {/* Admin Info */}
                                {isAdmin && (
                                    <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-lg p-3 text-center">
                                        <p className="text-xs text-indigo-700 font-semibold">
                                            🔑 Admin Mode: Purchase functions disabled.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* --- LEFT COLUMN: CONTENT (ORDERED SECOND ON MOBILE) --- */}
                    <div className="lg:col-span-2 order-last lg:order-first">
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                </span>
                                Course Curriculum
                            </h2>
                            <ul className="space-y-4">
                                {course.lectures && course.lectures.length > 0 ? (
                                    course.lectures.map((lecture, index) => (
                                        <li key={lecture._id} className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200">
                                            <div className="flex items-center min-w-0">
                                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white text-indigo-600 font-bold rounded-full shadow-sm text-sm mr-4 border border-gray-200 group-hover:border-indigo-300">
                                                    {index + 1}
                                                </span>
                                                <span className="text-sm sm:text-base text-gray-800 font-medium truncate group-hover:text-indigo-700 transition-colors">{lecture.title}</span>
                                            </div>
                                            
                                            {hasAccess ? (
                                                <Link 
                                                    to={`/course/${courseId}/watch?lectureId=${lecture._id}`} 
                                                    className="flex items-center text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold shadow-md transition-all hover:scale-105 ml-4 flex-shrink-0"
                                                >
                                                    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
                                                    Watch
                                                </Link>
                                            ) : (
                                                <div className="flex items-center text-gray-400 text-sm ml-4 flex-shrink-0">
                                                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                                                    Locked
                                                </div>
                                            )}
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-500 italic p-4 text-center">No curriculum content has been added yet.</p>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;