// src/pages/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../api/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        try {
            await auth.register(formData);
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {message && <p className="text-green-600 text-sm">{message}</p>}
                
                {/* Input fields for name, email, password */}
                {/* ... (standard input fields using formData and handleChange) ... */}
                
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-medium">
                    Register
                </button>
                <div className="text-center text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
                </div>
            </form>
        </div>
    );
};

export default Register;