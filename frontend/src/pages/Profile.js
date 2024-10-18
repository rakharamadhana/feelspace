import React, { useState, useEffect } from 'react';
import api from '../api'; // Import the api instance

const Profile = () => {
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
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
            api.post('/change-password', { oldPassword, newPassword }, {
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
            api.post('/change-profile', { newName, newEmail }, {
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
        <>
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
                    disabled={true}
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
                    disabled={true}
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
                disabled={true}
            >
                Change Password
            </button>
            {message && <p className="text-center">{message}</p>}
        </>
    );
};

export default Profile;
