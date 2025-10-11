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

    // --- Utility Functions ---

    // Fetch all courses to populate the selection dropdown for lecture linking
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetching all courses helps the admin link lectures easily
                const res = await courses.search('');
                // Support multiple response shapes: res.data.data OR res.data
                const list = res?.data?.data ?? res?.data ?? [];
                setAvailableCourses(Array.isArray(list) ? list : []);
            } catch (err) {
                console.error("Failed to load courses for linking:", err);
                setAvailableCourses([]);
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
             // Use the filename as a default title
            setLectureTitle(file.name.replace(/\.[^/.]+$/, "")); 
        }
    };
    
    // --- 1. Create New Course Handler (Requirement 2) ---
    const createNewCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            // Price must be a number
            const priceAsNumber = parseFloat(newCourseData.price);
            if (isNaN(priceAsNumber) || priceAsNumber <= 0) {
                setError("Price must be a valid positive number.");
                setLoading(false);
                return;
            }

            const payload = { ...newCourseData, price: priceAsNumber };

            const res = await courses.createCourse(payload);

            // Support multiple response shapes
            const created = res?.data?.data ?? res?.data ?? res;
            const createdCourse = (Array.isArray(created) ? created[0] : created) || created;

            setMessage(`Course "${createdCourse.title || createdCourse.name || 'Untitled'}" created successfully!`);

            // Update UI lists and pre-select the new course for lecture upload
            setAvailableCourses(prev => [...prev, createdCourse]);
            setSelectedCourseId(createdCourse._id || createdCourse.id || '');
            setNewCourseData({ title: '', description: '', price: '' });
            
        } catch (err) {
            setError(`Error creating course: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- 2. Upload Lecture Handler (Requirement 2, 8) ---
    const uploadLecture = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (!selectedCourseId) {
            setError("Please select a course before uploading the lecture.");
            return;
        }
        if (!lectureFile) {
            setError("Please select a video file for upload.");
            return;
        }
        
        setLoading(true);

    // Prepare FormData for multi-part submission
        const formData = new FormData();
        // The key 'video' MUST match the name used by Multer in uploadMiddleware.js
        formData.append('video', lectureFile); 
        formData.append('title', lectureTitle); 
        
        try {
            // API call to POST /api/v1/courses/:courseId/lectures
            await courses.uploadLecture(selectedCourseId, formData);

            setMessage(`Lecture "${lectureTitle}" uploaded to course successfully!`);

            // Clear inputs upon success and reset file input element
            setLectureFile(null);
            setLectureTitle('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            
        } catch (err) {
            setError(`Error uploading lecture: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Admin: Add Content</h1>
            
            {(message || error) && (
                <div className={`p-3 mb-4 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {error || message}
                </div>
            )}

            {/* --- 1. Course Creation Form --- */}
            <form onSubmit={createNewCourse} className="bg-white p-6 rounded shadow-lg mb-8 border-t-4 border-blue-400">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">Create New Course</h2>
                
                <div className="space-y-4">
                    <input type="text" name="title" placeholder="Course Title" required value={newCourseData.title} onChange={handleCourseChange} className="w-full p-2 border rounded" />
                    <textarea name="description" placeholder="Course Description" required value={newCourseData.description} onChange={handleCourseChange} rows="3" className="w-full p-2 border rounded resize-none"></textarea>
                    <input type="text" name="price" placeholder="Price (e.g., 999.00)" required value={newCourseData.price} onChange={handleCourseChange} className="w-full p-2 border rounded" />
                </div>
                
                <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-medium transition">
                    {loading ? 'Creating...' : 'Create Course'}
                </button>
            </form>

            {/* --- 2. Lecture Upload Form --- */}
            <form onSubmit={uploadLecture} className="bg-white p-6 rounded shadow-lg border-t-4 border-green-400">
                <h2 className="text-xl font-semibold mb-4 text-green-800">Upload Lecture Video</h2>
                
                {/* Course Selector */}
                <select 
                    onChange={(e) => setSelectedCourseId(e.target.value)} 
                    value={selectedCourseId} 
                    required
                    className="w-full p-2 border mb-4 rounded bg-gray-50"
                >
                    <option value="">-- Select Course to Add Lecture To --</option>
                    {availableCourses.map(c => (
                        <option key={c._id} value={c._id}>{c.title}</option>
                    ))}
                </select>

                <input 
                    type="text" 
                    placeholder="Lecture Title" 
                    required 
                    value={lectureTitle} 
                    onChange={(e) => setLectureTitle(e.target.value)} 
                    className="w-full p-2 border mb-4 rounded" 
                />

                {/* File Input */}
                <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange} 
                    required 
                    accept="video/*" 
                    className="w-full p-2 border mb-4 rounded bg-gray-50 text-sm" 
                />
                
                <button type="submit" disabled={loading || !lectureFile || !selectedCourseId} className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 font-medium transition">
                    {loading ? 'Uploading & Saving...' : 'Upload Lecture to Cloudinary'}
                </button>
            </form>
        </div>
    );
};

export default AddCourse;