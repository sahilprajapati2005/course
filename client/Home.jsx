// Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from './src/api/api.js';

// A simple loading skeleton component for courses
const CourseSkeleton = () => (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        <div className="flex justify-between items-center mt-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
        </div>
    </div>
);

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
        } catch (err) {
            setError('Failed to load courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Simulate a slightly longer load time to see skeleton
        const timer = setTimeout(() => fetchCourses(), 500);
        return () => clearTimeout(timer);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(searchQuery);
    };

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-indigo-800 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl animate-fade-in-down">
                        Discover Your Next Passion
                    </h1>
                    <p className="mt-6 text-xl text-indigo-200 max-w-2xl mx-auto animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
                        High-quality online courses to help you grow professionally and personally.
                    </p>
                    <form onSubmit={handleSearch} className="mt-8 flex max-w-md mx-auto rounded-md shadow-lg animate-fade-in-down" style={{ animationDelay: '0.4s' }}>
                        <input
                            type="text"
                            placeholder="Search for anything..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-grow p-4 rounded-l-md border-0 focus:ring-indigo-500 text-gray-800"
                        />
                        <button type="submit" className="bg-indigo-500 text-white px-6 py-3 rounded-r-md hover:bg-indigo-600 transition duration-300">
                            Search
                        </button>
                    </form>
                </div>
            </div>
            
            {/* Features Section */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900">Why Learn with CourseBuy?</h2>
                    </div>
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <h3 className="text-xl font-semibold text-gray-900">Expert Instructors</h3>
                            <p className="mt-2 text-gray-600">Learn from industry experts who are passionate about teaching.</p>
                        </div>
                        <div className="text-center p-6">
                            <h3 className="text-xl font-semibold text-gray-900">Lifetime Access</h3>
                            <p className="mt-2 text-gray-600">Buy a course once and have unlimited access to it forever.</p>
                        </div>
                        <div className="text-center p-6">
                            <h3 className="text-xl font-semibold text-gray-900">Learn Anywhere</h3>
                            <p className="mt-2 text-gray-600">Access courses on any device, anytime, and learn at your own pace.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Courses Section */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
                        Explore Our Courses
                    </h2>
                    {error && <p className="text-center text-red-500">{error}</p>}
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)
                        ) : (
                            courseList.map(course => (
                                <Link key={course._id} to={`/course/${course._id}`} className="block group">
                                    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                        <div className="p-6 flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 h-14">{course.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{course.description.substring(0, 120)}...</p>
                                        </div>
                                        <div className="p-6 bg-gray-50 flex justify-between items-center">
                                            <p className="text-lg font-bold text-indigo-600">₹{Number(course.price).toFixed(2)}</p>
                                            <span className="text-sm font-medium text-gray-700 bg-gray-200 px-3 py-1 rounded-full">{course.totalEnrollments || 0} enrolled</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    {!loading && courseList.length === 0 && (
                        <p className="text-center text-gray-500 mt-8">No courses matched your search.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;