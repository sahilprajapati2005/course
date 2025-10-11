// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../api/api.js';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Function to parse the user data from the token (simplified)
    const parseToken = (token) => {
        if (!token) return null;
        try {
            // NOTE: In a real app, you would decode the JWT to get role/user info
            // For now, we'll assume a successful login returns user data.
            // We just store the role and essential fields.
            const user = JSON.parse(localStorage.getItem('user'));
            return user || null;
        } catch (e) {
            console.error("Failed to parse token/user from localStorage");
            return null;
        }
    };
    
    useEffect(() => {
        if (token) {
            setUser(parseToken(token));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        const res = await auth.login({ email, password });
        const { token: newToken, data: { user: userData } } = res.data;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData)); // Store user data
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isAdmin = user?.role === 'admin';

    return (
        <AuthContext.Provider value={{ user, token, isAdmin, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};