import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterTeacher = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        axios.post('http://localhost:3001/register', { email, password, role: 'Teacher', name })
            .then(response => {
                setSuccess('Registration successful! Redirecting to login...');
                setError('');
                setTimeout(() => {
                    navigate('/login');
                }, 1000); // Redirect after 2 seconds
            })
            .catch(error => {
                console.error('Registration error:', error);
                setError('An error occurred. Please try again.');
                setSuccess('');
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleRegister();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff4e3' }}>
            <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-3xl font-bold text-center mb-6">Register as Teacher</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && <p className="text-green-500 text-center mb-4">{success}</p>}
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
                >
                    Register
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default RegisterTeacher;
