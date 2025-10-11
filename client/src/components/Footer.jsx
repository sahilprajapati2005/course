// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1">
                        <h3 className="text-xl font-bold mb-2">CourseBuy</h3>
                        <p className="text-gray-400 text-sm">Empowering learners through accessible online education.</p>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-md font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
                            <li><Link to="/user/dashboard" className="text-gray-400 hover:text-white">My Courses</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-md font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-md font-semibold mb-4">Follow Us</h4>
                        <div className="flex space-x-4">
                            {/* Add social media links here */}
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} CourseBuy Platform. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;