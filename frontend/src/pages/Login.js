import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        api.post('/login', { email, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('email', response.data.email);

                if (response.data.role === 'Admin') {
                    navigate('/admin-dashboard');
                } else if (response.data.role === 'Teacher') {
                    navigate('/teacher-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
                setError('An error occurred. Please try again later.');
            });

    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff4e3' }}>
            <div className="flex flex-col lg:flex-row xl:flex-row w-full max-w-6xl mx-auto bg-[#fff4e3]">
                {/* Text Section */}
                <div className="flex-1 flex flex-col justify-center items-center lg:items-start xl:items-start text-center lg:text-left xl:text-left p-6 lg:p-12 xl:p-16">
                    <h1 className="text-4xl lg:text-5xl xl:text-5xl font-bold text-orange-600 mb-4 lg:mb-6 xl:mb-8">
                        玩轉情緒學習平台
                    </h1>
                    <h2 className="text-2xl lg:text-4xl xl:text-5xl font-semibold text-gray-800">
                        FeelSpace Navigator
                    </h2>
                </div>
                {/* Form Section */}
                <div className="flex-1 flex justify-center items-center p-6 lg:p-12 xl:p-16">
                    <div className="bg-white p-8 lg:p-10 xl:p-12 rounded-lg shadow-lg w-full max-w-md">
                        <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-8 text-gray-800">歡迎！登入你的帳號</h1>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <div className="flex items-center justify-between mt-4">
                            <label className="flex items-center text-gray-600">
                                <input type="checkbox" className="form-checkbox h-4 w-4 text-orange-500"/>
                                <span className="ml-2">記得我</span>
                            </label>
                            <a href="#" className="text-sm text-blue-500 hover:underline">忘記密碼了嗎？</a>
                        </div>
                        <button onClick={handleLogin}
                                className="w-full mt-6 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-orange-700 transition duration-300">
                            登入
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
