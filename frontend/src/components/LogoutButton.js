import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white p-2">
            Logout
        </button>
    );
};

export default LogoutButton;
