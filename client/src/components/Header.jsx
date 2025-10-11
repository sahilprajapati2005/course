// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, isAdmin, logout } = useAuth();

    return (
        <header className="bg-gray-800 text-white shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
                {/* Logo/Home Link */}
                <Link to="/" className="text-2xl font-bold tracking-wider hover:text-indigo-400 transition">
                    CourseBuy 🛒
                </Link>

                {/* Navigation Links */}
                <nav className="flex space-x-4">
                    {/* Admin Links */}
                    {isAdmin && (
                        <>
                            <Link to="/admin/dashboard" className="hover:text-indigo-400 hidden sm:inline">
                                Admin Dashboard
                            </Link>
                            <Link to="/admin/add-course" className="hover:text-indigo-400 hidden sm:inline">
                                Add Course
                            </Link>
                        </>
                    )}

                    {/* User Links */}
                    {user && !isAdmin && (
                        <Link to="/user/dashboard" className="hover:text-indigo-400">
                            My Courses
                        </Link>
                    )}
                    
                    {/* Auth Links */}
                    {user ? (
                        <button 
                            onClick={logout} 
                            className="text-red-400 hover:text-red-300 transition font-medium"
                        >
                            Logout ({user.name})
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-indigo-400">Login</Link>
                            <Link to="/register" className="hover:text-indigo-400">Register</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;