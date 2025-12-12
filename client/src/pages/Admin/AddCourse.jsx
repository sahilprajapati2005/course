// src/pages/Admin/AddCourse.jsx
import React, { useState, useEffect, useRef } from 'react';
import { courses } from '../../api/api';

const AddCourse = () => {
    // State for creating a new course
    const [newCourseData, setNewCourseData] = useState({ title: '', description: '', price: '' });
    // State for linking lectures
    const [availableCourses, setAvailableCourses] = useState([]); 
    const [selectedCourseId, setSelectedCourseId] = useState(''); 
    // State for lecture upload
    const [lectureFile, setLectureFile] = useState(null);
    const [lectureTitle, setLectureTitle] = useState('');
    const fileInputRef = useRef(null);
    
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courses.search('');
                const list = res?.data?.data ?? res?.data ?? [];
                setAvailableCourses(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error("Failed to load courses:", err);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseChange = (e) => {
        setNewCourseData({ ...newCourseData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setLectureFile(file);
        if (file) {
            setLectureTitle(file.name.replace(/\.[^/.]+$/, "")); 
        }
    };
    
    // --- 1. Create New Course Handler ---
    const createNewCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const priceAsNumber = parseFloat(newCourseData.price);
            if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
                setError("Price must be a valid positive number.");
                setLoading(false);
                return;
            }

            const payload = { ...newCourseData, price: priceAsNumber };
            const res = await courses.createCourse(payload);
            const created = res?.data?.data ?? res?.data ?? res;
            const createdCourse = (Array.isArray(created) ? created[0] : created) || created;

            setMessage(`Course "${createdCourse.title}" created!`);
            setAvailableCourses(prev => [...prev, createdCourse]);
            setSelectedCourseId(createdCourse._id || createdCourse.id || '');
            setNewCourseData({ title: '', description: '', price: '' });
            
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };
    
    // --- 2. Upload Lecture Handler ---
    const uploadLecture = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setShowPopup(false);
        
        if (!selectedCourseId || !lectureFile) return;
        
        setLoading(true);
        const formData = new FormData();
        formData.append('video', lectureFile); 
        formData.append('title', lectureTitle); 
        
        try {
            await courses.uploadLecture(selectedCourseId, formData);
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 4000);
            setLectureFile(null);
            setLectureTitle('');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-6xl mx-auto relative">
                
                {/* Popup Notification */}
                {showPopup && (
                    <div className="fixed top-24 right-5 z-50 animate-bounce bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center space-x-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <div>
                            <h4 className="font-bold">Success!</h4>
                            <p className="text-sm">Video uploaded.</p>
                        </div>
                    </div>
                )}

                <h1 className="text-3xl font-bold mb-8 text-gray-900">Manage Content</h1>
                
                {(message || error) && (
                    <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${error ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {error || message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* --- Card 1: Create Course --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6">
                            <span className="bg-indigo-100 p-2 rounded-lg text-indigo-600 mr-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">Create New Course</h2>
                        </div>
                        
                        <form onSubmit={createNewCourse} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input type="text" name="title" required value={newCourseData.title} onChange={handleCourseChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="e.g. Advanced React Patterns" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" required value={newCourseData.description} onChange={handleCourseChange} rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition resize-none" placeholder="Course overview..."></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input type="number" name="price" required value={newCourseData.price} onChange={handleCourseChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" placeholder="999" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full mt-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-medium transition shadow-sm disabled:opacity-70">
                                {loading ? 'Processing...' : 'Create Course'}
                            </button>
                        </form>
                    </div>

                    {/* --- Card 2: Upload Lecture --- */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center mb-6">
                            <span className="bg-green-100 p-2 rounded-lg text-green-600 mr-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">Upload Video Content</h2>
                        </div>

                        <form onSubmit={uploadLecture} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
                                <select 
                                    onChange={(e) => setSelectedCourseId(e.target.value)} 
                                    value={selectedCourseId} 
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition bg-white"
                                >
                                    <option value="">-- Choose a Course --</option>
                                    {availableCourses.map(c => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lecture Title</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={lectureTitle} 
                                    onChange={(e) => setLectureTitle(e.target.value)} 
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                                    placeholder="e.g. Introduction to Hooks"
                                />
                            </div>

                            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-center hover:bg-gray-100 transition cursor-pointer relative">
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    onChange={handleFileChange} 
                                    required 
                                    accept="video/*" 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="space-y-2 pointer-events-none">
                                    <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <p className="text-sm text-gray-600">
                                        {lectureFile ? (
                                            <span className="font-semibold text-green-600">{lectureFile.name}</span>
                                        ) : (
                                            "Click or drag video file here"
                                        )}
                                    </p>
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading || !lectureFile || !selectedCourseId} 
                                className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 font-medium transition shadow-sm disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Uploading...
                                    </>
                                ) : 'Upload Lecture'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourse;