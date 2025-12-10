// src/components/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
    const { user, isAdmin, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Add shadow on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Styling classes for Nav Links
    const baseLinkClass = "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ease-in-out";
    const inactiveLinkClass = "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50";
    const activeLinkClass = "text-indigo-700 bg-indigo-50 font-semibold shadow-sm";

    const closeMobileMenu = () => setIsMenuOpen(false);

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 border-b border-gray-100 ${
                scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-3'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    
                    {/* --- Logo --- */}
                    <Link to="/" className="flex items-center space-x-2 group" onClick={closeMobileMenu}>
                        <img 
                            src={logo} 
                            alt="SkillForge Logo" 
                            className="h-10 sm:h-12 w-auto transition-transform duration-300 group-hover:scale-105" 
                        />
                        {/* Optional: Add Text next to logo if needed */}
                        {/* <span className="text-xl font-bold text-gray-900 tracking-tight">Skill<span className="text-indigo-600">Forge</span></span> */}
                    </Link>

                    {/* --- Desktop Navigation --- */}
                    <nav className="hidden md:flex items-center space-x-2">
                        <NavLink to="/" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                            Home
                        </NavLink>
                        
                        {isAdmin && (
                            <>
                                <NavLink to="/admin/dashboard" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    Dashboard
                                </NavLink>
                                <NavLink to="/admin/add-course" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                    Add Course
                                </NavLink>
                            </>
                        )}
                        
                        {user && !isAdmin && (
                            <NavLink to="/user/dashboard" className={({ isActive }) => `${baseLinkClass} ${isActive ? activeLinkClass : inactiveLinkClass}`}>
                                My Courses
                            </NavLink>
                        )}
                    </nav>

                    {/* --- Desktop Buttons --- */}
                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-500">
                                    Hi, {user.name?.split(' ')[0] || 'User'}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-5 py-2 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 shadow-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-gray-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                                >
                                    Join for Free
                                </Link>
                            </>
                        )}
                    </div>

                    {/* --- Mobile Menu Button --- */}
                    <div className="md:hidden flex items-center">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)} 
                            className="p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Mobile Menu (Dropdown) --- */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 animate-fade-in-down">
                    <nav className="px-4 pt-4 pb-6 space-y-2">
                        {user && (
                            <div className="mb-4 pb-4 border-b border-gray-100 flex items-center px-2">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold mr-3">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <span className="font-semibold text-gray-800">{user.name}</span>
                            </div>
                        )}

                        <NavLink 
                            to="/" 
                            onClick={closeMobileMenu} 
                            className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            Home
                        </NavLink>

                        {isAdmin && (
                            <>
                                <NavLink to="/admin/dashboard" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>Dashboard</NavLink>
                                <NavLink to="/admin/add-course" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>Add Course</NavLink>
                            </>
                        )}
                        
                        {user && !isAdmin && (
                            <NavLink to="/user/dashboard" onClick={closeMobileMenu} className={({ isActive }) => `block px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>My Courses</NavLink>
                        )}

                        <div className="mt-6 pt-4 border-t border-gray-100">
                            {user ? (
                                <button 
                                    onClick={() => { logout(); closeMobileMenu(); }} 
                                    className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-base font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                >
                                    Log Out
                                </button>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={closeMobileMenu} className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200">
                                        Log In
                                    </Link>
                                    <Link to="/register" onClick={closeMobileMenu} className="flex justify-center items-center px-4 py-3 rounded-xl text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;