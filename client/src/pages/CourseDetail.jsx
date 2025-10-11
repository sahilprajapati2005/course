// src/pages/CourseDetail.jsx
import  { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Link added for watching
import { courses, payment, dashboard } from '../api/api.js';
import { useAuth } from './context/AuthContext.jsx';

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 1. Fetch Course Data and Check Enrollment Status ---
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                // Fetch course details
                const courseRes = await courses.getDetails(courseId);
                setCourse(courseRes.data?.data ?? courseRes.data ?? null);
                
                // Check enrollment status (only if user is logged in)
                if (user) {
                    // This checks the User Dashboard API for the purchased course list
                    const dashboardRes = await dashboard.getUserCourses();
                    const list = dashboardRes?.data?.data ?? dashboardRes?.data ?? [];
                    const alreadyBought = Array.isArray(list) && list.some(c => c._id === courseId);
                    setIsEnrolled(Boolean(alreadyBought));
                }

                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load course details.');
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [courseId, user]);

    // --- 2. Load Razorpay Script Utility (improved) ---
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
            script.onerror = () => {
                console.error('Failed to load Razorpay script');
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // --- 3. Handle Purchase Flow (Requirement 6) ---
    const handleBuyCourse = async () => {
        if (!course || !user || isEnrolled) return;
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) return;

        try {
            // Step 1: Backend creates Order (POST /api/v1/payment/create-order)
            const orderRes = await payment.createOrder(courseId);
            // orderRes.data may contain different shapes; support both
            const orderId = orderRes?.data?.orderId ?? orderRes?.data?.id ?? orderRes?.data?.order_id ?? null;
            const amount = orderRes?.data?.amount ?? orderRes?.data?.price ?? orderRes?.data?.data?.amount ?? null;

            // Step 2: Configure and Open Razorpay Checkout
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: (Number(amount) || Number(course.price) || 0) * 100, // Amount in Paise
                currency: "INR",
                name: "Course Buy Platform",
                description: `Purchase: ${course.title}`,
                order_id: orderId,
                
                handler: async function (response) {
                    // Step 3: Backend verifies signature (POST /api/v1/payment/verify-payment)
                    const verifyData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                    };
                    
                    const verifyRes = await payment.verifyPayment(verifyData);
                    
                    if (verifyRes.data.success) {
                        alert("Purchase successful! Course unlocked.");
                        setIsEnrolled(true);
                        navigate('/user/dashboard'); 
                    } else {
                        alert("Payment successful, but verification failed. Contact support.");
                    }
                },
                
                prefill: { name: user.name, email: user.email },
                theme: { color: "#3B82F6" },
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response){
                alert(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open(); 

        } catch (err) {
            console.error("Purchase initiation error:", err.response?.data || err.message);
            alert("Error initiating payment. Please ensure you are logged in.");
        }
    };
    
    if (loading) return <div className="p-8 text-center">Loading Course Details...</div>;
    if (error) return <div className="p-8 text-red-600 bg-red-100 rounded m-4">{error}</div>;
    if (!course) return <div className="p-8 text-center">Course Not Found.</div>;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
            <h1 className="text-4xl font-extrabold mb-4 text-indigo-700">{course.title}</h1>
            <p className="text-xl font-medium text-gray-700 mb-6">{course.description ?? 'No description available.'}</p>
            
            <hr className="my-6" />

            <h2 className="text-2xl font-bold mb-4">Course Content</h2>
            <ul className="list-disc ml-6 space-y-2 mb-8 text-gray-800">
                {/* Note: This assumes lectures is an array on the course object */}
                {Array.isArray(course.lectures) && course.lectures.map((lecture, index) => (
                    <li key={lecture._id ?? index} className="flex justify-between items-center">
                        <span>{index + 1}. {lecture.title ?? 'Untitled Lecture'}</span>
                        {isEnrolled ? (
                            // Link to LecturePlayer (requires a lecture ID, simplified here)
                            <Link to={`/course/${courseId}/watch?lectureId=${lecture._id}`} className="text-green-600 hover:underline text-sm font-semibold">
                                Watch
                            </Link>
                        ) : (
                            <span className="text-red-500 text-sm">Locked</span>
                        )}
                    </li>
                ))}
            </ul>

            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                <p className="text-3xl font-extrabold text-blue-600">Price: ₹{(course.price != null && !isNaN(Number(course.price))) ? Number(course.price).toFixed(2) : '0.00'}</p>
                
                <button 
                    onClick={handleBuyCourse}
                    disabled={isEnrolled || !user}
                    className={`px-8 py-3 text-lg font-bold rounded-lg transition ${
                        isEnrolled 
                            ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                >
                    {isEnrolled ? "Access Course (Purchased)" : (user ? "Buy Now" : "Login to Buy")}
                </button>
            </div>
            {!user && <p className="text-sm text-center text-red-500 mt-2">You must be logged in to purchase this course.</p>}
        </div>
    );
};

export default CourseDetail;
