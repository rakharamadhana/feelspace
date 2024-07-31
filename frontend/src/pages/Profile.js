import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SideNav from '../components/SideNav';

const Profile = () => {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    useEffect(() => {
        setNewName(name);
        setNewEmail(email);
    }, [name, email]);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^[a-zA-Z0-9]+$/;
        return passwordRegex.test(password);
    };

    const handleChangePassword = () => {
        const token = localStorage.getItem('token');
        const passwordErrors = {};

        if (!oldPassword) {
            passwordErrors.oldPassword = 'Old password is required';
        }
        if (!validatePassword(newPassword)) {
            passwordErrors.newPassword = 'Password must be alphanumeric';
        }

        if (Object.keys(passwordErrors).length === 0) {
            axios.post('http://localhost:3001/change-password', { oldPassword, newPassword }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    setMessage('Password changed successfully!');
                    setErrors({});
                })
                .catch(error => {
                    if (error.response && error.response.status === 401) {
                        setErrors({ oldPassword: 'Old password is incorrect' });
                    } else {
                        setMessage('Failed to change password.');
                    }
                });
        } else {
            setErrors(passwordErrors);
        }
    };

    const handleChangeProfile = () => {
        const token = localStorage.getItem('token');
        const profileErrors = {};

        if (!validateEmail(newEmail)) {
            profileErrors.email = 'Email must be valid';
        }

        if (Object.keys(profileErrors).length === 0) {
            axios.post('http://localhost:3001/change-profile', { newName, newEmail }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    localStorage.setItem('name', newName);
                    localStorage.setItem('email', newEmail);
                    setMessage('Profile updated successfully!');
                    setErrors({});
                })
                .catch(error => {
                    setMessage('Failed to update profile.');
                });
        } else {
            setErrors(profileErrors);
        }
    };

    return (
        <div className="flex min-h-screen">
            {role === 'Student' ? <Navbar role={role} /> : <SideNav role={role} />}
            <div className={`flex-grow p-10 text-black ${role === 'Student' ? 'flex flex-col items-center' : ''}`} style={{ backgroundColor: '#fff4e3' }}>
                <div className="bg-white text-black p-10 rounded-lg shadow-lg max-w-md w-full mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-6">Profile</h1>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Name</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Old Password</label>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">New Password</label>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword}</p>}
                    </div>
                    <button
                        onClick={handleChangeProfile}
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
                    >
                        Update Profile
                    </button>
                    <button
                        onClick={handleChangePassword}
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
                    >
                        Change Password
                    </button>
                    {message && <p className="text-center">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default Profile;
