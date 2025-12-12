// client/Home.jsx
import React, { useState, useEffect } from 'react';
import { courses } from './src/api/api.js';
import CourseCard from './src/components/CourseCard.jsx';

// Skeleton Loader for better UX
const CourseSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 animate-pulse h-full">
        <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
        <div className="flex justify-between mt-auto">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/6"></div>
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
            setError('Failed to load courses. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => fetchCourses(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(searchQuery);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* --- HERO SECTION --- */}
            <section className="relative bg-white overflow-hidden">
                <div className="absolute inset-0 bg-indigo-50/50"></div>
                
                {/* Decorative Blobs */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 flex flex-col items-center text-center z-10">
                    
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold tracking-wide uppercase mb-6">
                        Learn without limits
                    </span>
                    
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Master New Skills with <br className="hidden sm:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            Expert-Led Courses
                        </span>
                    </h1>
                    
                    <p className="max-w-2xl text-lg sm:text-xl text-gray-600 mb-10 leading-relaxed">
                        Join thousands of learners worldwide. Build skills with courses, certificates, and degrees online from world-class instructors.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 text-gray-900 placeholder-gray-400 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 shadow-xl shadow-indigo-100/50 transition-all duration-300 sm:text-base"
                                placeholder="What do you want to learn today?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute inset-y-1.5 right-1.5">
                                <button type="submit" className="h-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-sm font-semibold transition-colors shadow-md">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </section>

            {/* --- COURSE GRID SECTION --- */}
            <section className="flex-grow py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Explore Courses</h2>
                            <p className="mt-2 text-gray-500">Discover top-rated content across various categories.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-md">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {loading ? (
                            // Render Skeletons
                            Array.from({ length: 8 }).map((_, index) => (
                                <CourseSkeleton key={index} />
                            ))
                        ) : courseList.length > 0 ? (
                            // Render Course Cards
                            courseList.map(course => (
                                <CourseCard key={course._id} course={course} />
                            ))
                        ) : (
                            // Empty State
                            <div className="col-span-full py-16 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900">No courses found</h3>
                                <p className="mt-1 text-gray-500">We couldn't find any courses matching "{searchQuery}".</p>
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="mt-6 text-indigo-600 hover:text-indigo-500 font-medium hover:underline"
                                >
                                    Clear search and view all
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;