// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from './src/api/api.js'; // fixed path to src/api

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCourses = async (query = '') => {
        setLoading(true);
        setError(null);
        try {
            const res = await courses.search(query);
            const list = res?.data?.data ?? res?.data ?? [];
            setCourseList(Array.isArray(list) ? list : []);
            setLoading(false);
        } catch (err) {
            // It's normal to get a 401 if not logged in, but we still show the page
            if (err.response?.status !== 401) {
                setError('Failed to load courses.');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(searchQuery);
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-indigo-700">Explore Our Courses</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex max-w-lg mx-auto mb-10 shadow-md rounded-lg overflow-hidden">
                <input
                    type="text"
                    placeholder="Search courses by title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow p-3 text-lg border-0 focus:ring-0"
                />
                <button type="submit" className="bg-indigo-600 text-white px-6 text-lg hover:bg-indigo-700">
                    Search
                </button>
            </form>

            {loading && <div className="text-center">Loading courses...</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courseList.map(course => (
                    <Link key={course._id ?? course.id ?? `${course.title}-${Math.random()}`} to={`/course/${course._id ?? course.id}`} className="block">
                        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
                            <h2 className="text-xl font-bold mb-2">{course.title ?? 'Untitled Course'}</h2>
                            <p className="text-gray-600 mb-4">{course.description ? `${course.description.substring(0, 150)}...` : 'No description available'}</p>
                            <p className="text-indigo-600 text-lg font-semibold">₹{(course.price != null && !isNaN(Number(course.price))) ? Number(course.price).toFixed(2) : '0.00'}</p>
                        </div>
                    </Link>
                ))}
            </div>
            {courseList.length === 0 && !loading && !error && (
                <div className="text-center text-gray-500 p-10">No courses available.</div>
            )}
        </div>
    );
};

export default Home;