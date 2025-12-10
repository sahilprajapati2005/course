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
    const [message, setMessage] = useState(''); // Inline message
    const [error, setError] = useState('');
    
    // NEW: State for the Success Popup
    const [showPopup, setShowPopup] = useState(false);

    // Fetch all courses to populate the selection dropdown
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courses.search('');
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

            setMessage(`Course "${createdCourse.title}" created successfully!`);
            
            // Update dropdown and select the new course
            setAvailableCourses(prev => [...prev, createdCourse]);
            setSelectedCourseId(createdCourse._id || createdCourse.id || '');
            setNewCourseData({ title: '', description: '', price: '' });
            
        } catch (err) {
            setError(`Error creating course: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };
    
    // --- 2. Upload Lecture Handler (With Popup Logic) ---
    const uploadLecture = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setShowPopup(false); // Reset popup
        
        if (!selectedCourseId) {
            setError("Please select a course before uploading the lecture.");
            return;
        }
        if (!lectureFile) {
            setError("Please select a video file for upload.");
            return;
        }
        
        setLoading(true);

        const formData = new FormData();
        formData.append('video', lectureFile); 
        formData.append('title', lectureTitle); 
        
        try {
            await courses.uploadLecture(selectedCourseId, formData);

            // --- SHOW POPUP ---
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 4000); // Hide after 4 seconds

            // Clear inputs
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
        <div className="p-4 md:p-8 max-w-4xl mx-auto relative">
            
            {/* --- SUCCESS POPUP --- */}
            {showPopup && (
                <div className="fixed top-20 right-5 z-50 animate-bounce">
                    <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <div>
                            <h4 className="font-bold text-lg">Success!</h4>
                            <p className="text-sm">Video uploaded successfully.</p>
                        </div>
                        <button onClick={() => setShowPopup(false)} className="ml-4 text-green-200 hover:text-white">
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Admin: Add Content</h1>
            
            {(message || error) && (
                <div className={`p-3 mb-4 rounded ${error ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                    {error || message}
                </div>
            )}

            {/* --- 1. Course Creation Form --- */}
            <form onSubmit={createNewCourse} className="bg-white p-6 rounded shadow-lg mb-8 border-t-4 border-blue-400">
                <h2 className="text-xl font-semibold mb-4 text-blue-800">1. Create New Course</h2>
                <div className="space-y-4">
                    <input type="text" name="title" placeholder="Course Title" required value={newCourseData.title} onChange={handleCourseChange} className="w-full p-2 border rounded" />
                    <textarea name="description" placeholder="Course Description" required value={newCourseData.description} onChange={handleCourseChange} rows="3" className="w-full p-2 border rounded resize-none"></textarea>
                    <input type="text" name="price" placeholder="Price (e.g., 999.00)" required value={newCourseData.price} onChange={handleCourseChange} className="w-full p-2 border rounded" />
                </div>
                <button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-medium transition">
                    {loading ? 'Processing...' : 'Create Course'}
                </button>
            </form>

            {/* --- 2. Lecture Upload Form --- */}
            <form onSubmit={uploadLecture} className="bg-white p-6 rounded shadow-lg border-t-4 border-green-400">
                <h2 className="text-xl font-semibold mb-4 text-green-800">2. Upload Lecture Video</h2>
                
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

                <input 
                    ref={fileInputRef}
                    type="file" 
                    onChange={handleFileChange} 
                    required 
                    accept="video/*" 
                    className="w-full p-2 border mb-4 rounded bg-gray-50 text-sm" 
                />
                
                <button type="submit" disabled={loading || !lectureFile || !selectedCourseId} className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 font-medium transition flex justify-center items-center">
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Uploading to Cloudinary...
                        </>
                    ) : 'Upload Lecture'}
                </button>
            </form>
        </div>
    );
};

export default AddCourse;