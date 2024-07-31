import React from 'react';
import SideNav from '../components/SideNav';

const AdminDashboard = () => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    return (
        <div className="flex">
            <SideNav role={role} />
            <div className="flex-grow p-10" style={{ backgroundColor: '#fff4e3' }}>
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
                    <p>Welcome, {role} {name}!</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
