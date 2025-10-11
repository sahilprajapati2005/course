// src/App.jsx
import React from 'react'; // <--- ADD THIS LINE
import { Routes, Route } from 'react-router-dom';
// Components
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx'; // Make sure Footer is also imported
// Context
import { AuthProvider } from './context/AuthContext.jsx';
// Route Protection
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Home from '../Home.jsx';
import CourseDetail from '../CourseDetail.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import UserDashboard from './pages/User/UserDashboard.jsx';
import LecturePlayer from './pages/User/LecturePlayer.jsx';
import AdminDashboard from './pages/Admin/AdminDashboard.jsx';
import AddCourse from './pages/Admin/AddCourse.jsx';

const App = () => {
    return (
        <AuthProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/course/:courseId" element={<CourseDetail />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* User Protected Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                            <Route path="/user/dashboard" element={<UserDashboard />} />
                            <Route path="/course/:courseId/watch" element={<LecturePlayer />} />
                        </Route>

                        {/* Admin Protected Routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/add-course" element={<AddCourse />} />
                        </Route>

                        {/* Catch-all or 404 Route */}
                        <Route path="*" element={<Home />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </AuthProvider>
    );
};

export default App;