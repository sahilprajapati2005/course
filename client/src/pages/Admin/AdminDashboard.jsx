// src/pages/Admin/AdminDashboard.jsx (Complete Code)

import React, { useState, useEffect } from 'react';
import { dashboard } from '../../api/api';

const AdminDashboard = () => {
    // 5. admin dashboard because he can see which user buy course and how many they buy and how much they paid
    const [stats, setStats] = useState({ totalRevenue: 0, totalEnrollments: 0, sales: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                const response = await dashboard.getAdminSales();
                setStats(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch admin data. You might not have admin privileges.");
                setLoading(false);
            }
        };
        fetchSalesData();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading Admin Data...</div>;
    if (error) return <div className="p-4 text-red-600 font-bold">{error}</div>;

    return (
        <div className="admin-dashboard p-4 md:p-8 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-indigo-700">Admin Sales Overview</h1>
            
            {/* Summary Cards (Mobile Responsive) */}
            <div className="stats-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="card bg-blue-100 p-6 rounded shadow-md border-b-4 border-blue-500">
                    <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-blue-800 mt-1">₹{stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="card bg-green-100 p-6 rounded shadow-md border-b-4 border-green-500">
                    <p className="text-sm text-gray-600 font-medium">Total Enrollments</p>
                    <p className="text-3xl font-extrabold text-green-800 mt-1">{stats.totalEnrollments}</p>
                </div>
                <div className="card bg-yellow-100 p-6 rounded shadow-md border-b-4 border-yellow-500">
                    <p className="text-sm text-gray-600 font-medium">Active Users</p>
                    {/* Placeholder for a useful metric */}
                    <p className="text-3xl font-extrabold text-yellow-800 mt-1">N/A</p> 
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-4">Detailed Sales Transactions</h2>
            
            {/* Mobile-friendly table view */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {stats.sales.map((sale, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-6 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{sale.user}</div>
                                    <div className="text-xs text-gray-500">{sale.userEmail}</div>
                                </td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{sale.courseTitle}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-sm font-semibold text-green-600">₹{sale.amountPaid.toFixed(2)}</td>
                                <td className="py-4 px-6 whitespace-nowrap text-xs text-gray-400">{sale.razorpayPaymentId.substring(0, 10)}...</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {stats.sales.length === 0 && (
                    <p className="text-center p-6 text-gray-500">No sales records found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;