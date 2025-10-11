// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
            <div className="max-w-7xl mx-auto text-sm">
                &copy; {new Date().getFullYear()} CourseBuy Platform. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;