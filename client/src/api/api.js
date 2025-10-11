// src/api/api.js
import axios from 'axios';

// Ensure this matches the VITE_BACKEND_URL in your frontend .env file
const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Interceptor: Attaches JWT for protected routes ---
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- API Functions Mapped to Backend Routes ---
export const auth = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
};

export const courses = {
    // 7. Search course
    search: (query) => api.get(`/courses/search?q=${query}`),
    getDetails: (courseId) => api.get(`/courses/${courseId}`),
    
    // 2. Admin adds course metadata
    createCourse: (data) => api.post('/courses', data),
    
    // 8. Admin upload videos lecture (Requires FormData for files)
    uploadLecture: (courseId, formData) => api.post(`/courses/${courseId}/lectures`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' } 
    }),
    
    // 3. User can watch the course after buy
    getLectureUrl: (courseId, lectureId) => api.get(`/courses/${courseId}/lectures/${lectureId}`),
};

export const payment = {
    // 6. Use payment system with the help of razorpay
    createOrder: (courseId) => api.post('/payment/create-order', { courseId }),
    verifyPayment: (data) => api.post('/payment/verify-payment', data),
};

export const dashboard = {
    // 4. User dashboard
    getUserCourses: () => api.get('/users/dashboard/my-courses'),
    // 5. Admin dashboard
    getAdminSales: () => api.get('/users/dashboard/admin'),
};