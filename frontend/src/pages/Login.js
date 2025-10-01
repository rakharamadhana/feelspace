import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import FadeIn from '../components/FadeIn';
import api from '../api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            api.post('/verify-token', { token })
                .then(response => {
                    if (response.data.role === 'Admin') {
                        navigate('/admin-dashboard');
                    } else if (response.data.role === 'Teacher') {
                        navigate('/teacher-dashboard');
                    } else {
                        navigate('/student-dashboard');
                    }
                })
                .catch(() => {
                    console.error('Token verification failed');
                });
        }
    }, [navigate]);

    const handleLogin = (event) => {
        event.preventDefault(); // Prevent default form submission
        api.post('/login', { email, password })
            .then(response => {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role);
                localStorage.setItem('name', response.data.name);
                localStorage.setItem('email', response.data.email);;
                localStorage.setItem('user', JSON.stringify(response.data));

                // Store both the message and type in one line
                localStorage.setItem('notification', JSON.stringify({ message: 'Login successful! Welcome back ' + response.data.name + '!', type: 'success' }));

                if (response.data.role === 'Admin') {
                    navigate('/admin-dashboard');
                } else if (response.data.role === 'Teacher') {
                    navigate('/teacher-dashboard');
                } else {
                    navigate('/student-dashboard');
                }
            })
            .catch(error => {
                if (error.response) {
                    // Check if there is specific error data from the server
                    const serverErrorMessage = error.response.data?.message || error.response.data; // Adjust based on the actual structure of your error response
                    setError(serverErrorMessage);
                } else {
                    // Fallback to a generic message if no specific error data is available
                    setError('An error occurred. Please try again later.');
                }
            });

    };

    return (
        <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#fff4e3' }}>
            <FadeIn>
                <div className="flex flex-col lg:flex-row xl:flex-row w-full max-w-6xl mx-auto bg-[#fff4e3]">
                    {/* Text Section */}
                    <div
                        className="flex-initial flex flex-col justify-center items-center lg:items-center xl:items-center text-center lg:text-center xl:text-center p-6 lg:p-12 xl:p-16 ">
                        <h1 className="text-4xl lg:text-5xl xl:text-5xl font-bold text-orange-600 mb-4 lg:mb-6 xl:mb-8 z-10">
                            玩轉情緒學習平台
                        </h1>
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-800 z-10">
                            FeelSpace Navigator
                        </h2>
                        {/* Right Section - Image */}
                        <div
                            className="absolute w-full h-96 bottom-0 flex justify-center lg:justify-center xl:justify-center items-center overflow-hidden z-0">
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/login-bg.png`}
                                alt="FeelSpace Navigator"
                                className="absolute top-0 xl:top-0 right-50 min-w-max h-auto z-0"
                            />
                        </div>
                    </div>
                    {/* Form Section */}
                    <div className="flex-1 flex justify-center items-center p-6 lg:p-12 xl:p-16 z-10">
                        <div className="bg-white p-8 lg:p-10 xl:p-12 rounded-lg shadow-lg w-full max-w-md">
                            <h1 className="text-2xl lg:text-3xl xl:text-3xl font-bold mb-8 text-gray-800">歡迎！登入你的帳號</h1>
                            {error && <p className="text-red-500 mb-4">{error}</p>}
                            <form onSubmit={handleLogin}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full mt-2 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                    autoComplete="email" // Add autocomplete for email
                                />
                                <div className="relative w-full mt-4">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                        autoComplete="current-password" // Add autocomplete for password
                                    />
                                    <span
                                        className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <label className="flex items-center text-gray-600">
                                        <input type="checkbox" className="form-checkbox h-4 w-4 text-orange-500"/>
                                        <span className="ml-2">記得我</span>
                                    </label>
                                    <a href="/" className="text-sm text-blue-500 hover:underline">忘記密碼了嗎？</a>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full mt-6 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-orange-700 hover:scale-110 active:scale-95 transition duration-300 ease-in-out">
                                    登入
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default Login;
