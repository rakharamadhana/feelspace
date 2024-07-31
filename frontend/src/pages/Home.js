import React from 'react';
import { Link } from 'react-router-dom';

const sampleImageURL = 'https://via.placeholder.com/800x600'; // Replace with a sample image URL

const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff4e3' }}>
            <div className="flex items-center justify-center w-full max-w mx-auto p-8">
                <div className="flex-1 text-center lg:text-center">
                    <h1 className="text-9xl font-bold text-orange-600 mb-4">玩轉情緒學習平台</h1>
                    <h2 className="text-7xl font-semibold text-gray-800 mb-12">FeelSpace Navigator</h2>
                    <Link to="/login"
                          className="w-72 h-96 bg-orange-500 text-white text-5xl font-bold py-3 px-10 rounded-xl shadow-lg hover:bg-orange-700 transition duration-300 mb-4 z-0">
                        登入
                    </Link>
                </div>
                <div className="inset-0 flex justify-end items-center overflow-hidden">
                    <img src={`${process.env.PUBLIC_URL}/assets/home-bg.png`} alt="FeelSpace Navigator"
                         className="w-max h-full"/>
                </div>
            </div>
        </div>
    );
};

export default Home;
