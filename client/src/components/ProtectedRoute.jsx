// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div className="p-4 text-center">Loading authentication...</div>;
    }

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in, but role is not allowed (e.g., user trying to access /admin)
        return <Navigate to="/" replace />; // Or render a 403 page
    }

    // Authenticated and authorized
    return <Outlet />;
};

export default ProtectedRoute;