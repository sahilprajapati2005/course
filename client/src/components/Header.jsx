// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Header = () => {
    const { user, isAdmin, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const linkClass = "text-gray-600 hover:text-indigo-600 transition duration-150 ease-in-out";
    const activeLinkClass = "text-indigo-600 font-semibold";

    const closeMobileMenu = () => setIsMenuOpen(false);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    
                    <Link to="/" className="flex items-center space-x-3">
                        {/* THIS IS THE UPDATED LINE 👇 */}
                        <img src={logo} alt="SkillForge Logo" className="h-12 w-auto" />
                        <span className="text-2xl font-bold text-indigo-600">
                           Academy.Com 
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Home</NavLink>
                        {isAdmin && (
                            <>
                                <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Dashboard</NavLink>
                                <NavLink to="/admin/add-course" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>Add Course</NavLink>
                            </>
                        )}
                        {user && !isAdmin && (
                            <NavLink to="/user/dashboard" className={({ isActive }) => isActive ? activeLinkClass : linkClass}>My Courses</NavLink>
                        )}
                    </nav>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <button
                                onClick={logout}
                                className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-indigo-600 focus:outline-none">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200">
                    <nav className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                        <NavLink to="/" onClick={closeMobileMenu} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>Home</NavLink>
                        {isAdmin && (
                            <>
                                <NavLink to="/admin/dashboard" onClick={closeMobileMenu} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>Dashboard</NavLink>
                                <NavLink to="/admin/add-course" onClick={closeMobileMenu} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>Add Course</NavLink>
                            </>
                        )}
                        {user && !isAdmin && (
                            <NavLink to="/user/dashboard" onClick={closeMobileMenu} className={({ isActive }) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'text-white bg-indigo-600' : 'text-gray-700 hover:bg-gray-100'}`}>My Courses</NavLink>
                        )}
                        <div className="border-t border-gray-200 mt-4 pt-4">
                            {user ? (
                                <button onClick={() => { logout(); closeMobileMenu(); }} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
                            ) : (
                                <>
                                    <Link to="/login" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Login</Link>
                                    <Link to="/register" onClick={closeMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Register</Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;