// src/components/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course }) => {
    return (
        <Link to={`/course/${course._id}`} className="block">
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
                <h2 className="text-xl font-bold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4 text-sm">
                    {course.description.substring(0, 100)}...
                </p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-indigo-600 text-lg font-semibold">
                        ₹{course.price.toFixed(2)}
                    </p>
                    <span className="text-sm text-gray-500">
                        {course.totalEnrollments || 0} enrolled
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default CourseCard;