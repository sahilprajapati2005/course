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
                // 4. user dashboard so he can see how much course he and she buy
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

    if (loading) return <div className="p-4">Loading your courses...</div>;
    if (error) return <div className="p-4 text-red-600">{error}</div>;

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Your Purchased Courses</h1>
            
            {purchasedCourses.length === 0 ? (
                <div className="text-gray-500 text-center p-10 border rounded">
                    You haven't purchased any courses yet. Start exploring!
                    <Link to="/" className="text-blue-600 block mt-2">Go to Home</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedCourses.map(course => (
                        <div key={course._id} className="bg-white p-4 rounded shadow hover:shadow-lg transition">
                            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                            <p className="text-gray-600 mb-4">{course.description ? `${course.description.substring(0, 100)}...` : 'No description available'}</p>
                            
                            {/* Link to the course's lecture player (3. user can watch the course after buy) */}
                            <Link 
                                to={`/course/${course._id}/watch`} 
                                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
                            >
                                Start Watching
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;