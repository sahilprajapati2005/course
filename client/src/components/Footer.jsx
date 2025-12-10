// client/src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 border-t border-gray-700 mt-12">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
                    {/* Column 1: Brand Info (Always visible) */}
                    <div className="col-span-2 md:col-span-1 lg:col-span-2 space-y-4">
                        <Link to="/" className="text-2xl font-bold text-white">
                            LearnSphere
                        </Link>
                        <p className="text-gray-400 text-sm">
                            Master new skills with our expertly crafted online courses. Quality education, accessible anytime.
                        </p>
                    </div>

                    {/* Column 2: Quick Links (Visible on larger screens) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-base text-gray-400 hover:text-white transition-colors">Home</Link></li>
                            <li><Link to="/user/dashboard" className="text-base text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
                            <li><Link to="/about" className="text-base text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                        </ul>
                    </div>
                    
                    {/* Column 3: Legal (Visible on larger screens) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li><Link to="/privacy" className="text-base text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-base text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/support" className="text-base text-gray-400 hover:text-white transition-colors">Support</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact/Social (Small on mobile, larger on desktop) */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                         <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                            Connect
                        </h3>
                        <div className="flex space-x-4">
                            {/* Simple Social Icons (using placeholders) */}
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.211-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.784 7 2.457v6.778z"/></svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.795-1.574 2.164-2.722-.951.555-2.005.959-3.127 1.184-.897-.957-2.178-1.555-3.594-1.555-3.124 0-5.663 2.539-5.663 5.663 0 .445.05.877.147 1.291-4.708-.237-8.882-2.492-11.671-5.91-.484.825-.765 1.782-.765 2.793 0 1.968.995 3.708 2.503 4.739-.925-.03-1.794-.282-2.551-.703v.07c0 2.748 1.956 5.043 4.545 5.568-.474.13-.978.201-1.494.201-.363 0-.715-.034-1.06-.102.722 2.24 2.81 3.882 5.299 3.926-1.942 1.522-4.39 2.433-7.058 2.433-.466 0-.923-.028-1.373-.082 2.528 1.623 5.544 2.576 8.79 2.576 10.518 0 16.208-8.708 16.208-16.208 0-.244-.005-.488-.013-.731.836-.605 1.564-1.353 2.14-2.222z"/></svg>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright/Bottom Bar */}
                <div className="mt-12 border-t border-gray-700 pt-8">
                    <p className="text-base text-gray-500 md:text-center">
                        &copy; {new Date().getFullYear()} LearnSphere, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;