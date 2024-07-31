import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        axios.post('http://localhost:3001/login', { email, password })
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
                if (error.response && error.response.status === 401) {
                    setError('Invalid email or password');
                } else if (error.response && error.response.status === 404) {
                    setError('User not found');
                } else {
                    setError('An error occurred. Please try again later.');
                }
            });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff4e3' }}>
            <div className="flex w-full max-w-9xl mx-auto bg-[#fff4e3]">
                <div className="flex-1 flex flex-col justify-center items-center text-center p-8">
                    <h1 className="text-9xl font-bold text-orange-600 mb-4">玩轉情緒學習平台</h1>
                    <h2 className="text-7xl font-semibold text-gray-800">FeelSpace Navigator</h2>
                    <div className="flex justify-end items-center overflow-hidden">
                        <img src={`${process.env.PUBLIC_URL}/assets/login-bg.png`} alt="FeelSpace Navigator"
                             className="w-full h-max"/>
                    </div>
                </div>
                <div className="flex-1 flex justify-center items-center p-10">
                    <div
                        className="bg-white py-60 px-10 rounded-lg shadow-lg w-full max-w-2xl border-8 border-orange-500">
                        <h1 className="text-3xl font-bold mb-8 text-gray-800">歡迎！登入你的帳號</h1>
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
