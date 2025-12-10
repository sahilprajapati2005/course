// client/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courses } from './src/api/api.js';

const CourseSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 animate-pulse">
        <div className="h-36 sm:h-48 bg-gray-200 rounded-xl mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-4/5 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
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
        // Initial load or load after typing stop
        const timer = setTimeout(() => fetchCourses(searchQuery), 500);
        return () => clearTimeout(timer);
    }, [searchQuery]); // Re-fetch when search query changes

    const handleSearch = (e) => {
        e.preventDefault();
        fetchCourses(searchQuery);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* --- HERO SECTION --- */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-500 blur-3xl"></div>
                    <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-indigo-500 blur-3xl"></div>
                </div>

                <div className="relative max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6 drop-shadow-lg">
                        Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Potential</span>
                    </h1>
                    <p className="mt-2 text-base sm:text-xl text-indigo-100 max-w-2xl font-light px-2">
                        Master new skills with our expertly crafted courses. Learn anytime, anywhere.
                    </p>

                    {/* --- RESPONSIVE STYLISH SEARCH BAR --- */}
                    <form onSubmit={handleSearch} className="mt-8 sm:mt-10 w-full max-w-xl md:max-w-2xl relative group px-4">
                        <div className="relative flex items-center">
                            {/* Search Icon */}
                            <div className="absolute left-4 sm:left-6 text-gray-400 pointer-events-none">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            
                            {/* Input Field */}
                            <input
                                type="text"
                                placeholder="What do you want to learn?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 sm:pl-16 pr-28 sm:pr-32 py-3 sm:py-5 rounded-full border-2 border-transparent bg-white/95 backdrop-blur-sm text-gray-900 placeholder-gray-500 shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-300 text-base sm:text-lg"
                            />
                            
                            {/* Search Button */}
                            <button 
                                type="submit" 
                                className="absolute right-1.5 sm:right-2 top-1.5 bottom-1.5 px-4 sm:px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 transform text-sm sm:text-base"
                            >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            
            {/* --- COURSES SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
                <div className="mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-4">
                        Explore Courses
                    </h2>
                </div>

                {error && <div className="text-center p-6 text-red-500 bg-red-50 rounded-xl mx-auto max-w-2xl">{error}</div>}
                
                <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <CourseSkeleton key={i} />)
                    ) : (
                        courseList.map(course => (
                            <Link key={course._id} to={`/course/${course._id}`} className="group h-full block">
                                <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 h-full flex flex-col overflow-hidden border border-gray-100 transform hover:-translate-y-1">
                                    {/* Gradient Thumbnail Placeholder - Height adjusted for mobile */}
                                    <div className="h-40 sm:h-48 bg-gradient-to-br from-indigo-400 to-purple-500 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                        <div className="absolute bottom-4 left-4">
                                            <span className="bg-white/90 backdrop-blur text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                                                Course
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 sm:p-6 flex-grow flex flex-col">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow">
                                            {course.description}
                                        </p>
                                        
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 uppercase font-semibold">Price</span>
                                                <span className="text-xl font-extrabold text-gray-900">
                                                    ₹{Number(course.price).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                                                <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"></path></svg>
                                                {course.totalEnrollments || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
                {!loading && courseList.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg mt-8">
                        <p className="text-gray-500 text-lg font-medium">No courses found matching your search: **"{searchQuery}"**</p>
                        <button onClick={() => setSearchQuery('')} className="mt-4 text-indigo-600 font-semibold hover:text-indigo-700 transition-colors underline">
                            Show All Courses
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;