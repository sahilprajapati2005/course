// src/components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    // Function to generate a consistent gradient based on course ID
    // This gives each card a distinct look without needing an image
    const getGradient = (id) => {
        const gradients = [
            'from-blue-500 to-indigo-600',
            'from-emerald-500 to-teal-600',
            'from-orange-500 to-red-600',
            'from-purple-500 to-pink-600', 
            'from-cyan-500 to-blue-600',
            'from-rose-500 to-pink-600'
        ];
        // Simple deterministic selection based on ID string
        const index = id ? id.charCodeAt(id.length - 1) % gradients.length : 0;
        return gradients[index];
    };

    const gradientClass = getGradient(course._id);

    return (
        <Link to={`/course/${course._id}`} className="group block h-full">
            <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">
                
                {/* Decorative Header / Thumbnail Placeholder */}
                <div className={`h-32 bg-gradient-to-r ${gradientClass} relative flex items-center justify-center overflow-hidden`}>
                    {/* Abstract Decorative Shapes */}
                    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-20 rounded-full blur-xl"></div>
                    <div className="absolute top-4 left-4 w-12 h-12 bg-white opacity-10 rounded-full"></div>
                    
                    {/* Course Icon */}
                    <svg className="w-12 h-12 text-white opacity-90 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    {/* Badge */}
                    <div className="flex justify-between items-start mb-3">
                        <span className="inline-block px-2.5 py-1 text-xs font-bold tracking-wide text-indigo-600 uppercase bg-indigo-50 rounded-full">
                            Course
                        </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {course.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                        {course.description}
                    </p>

                    {/* Footer: Price & Enrollments */}
                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-400 font-bold tracking-wider">Price</span>
                            <span className="text-xl font-extrabold text-gray-900">
                                ₹{course.price.toFixed(2)}
                            </span>
                        </div>
                        
                        <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-xs font-semibold">
                                {course.totalEnrollments || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;