// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const user = await login(email, password);
            
            // Redirect based on role (Requirement 1)
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                           className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required 
                           className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium">
                    Log In
                </button>
            </form>
        </div>
    );
};

export default Login;