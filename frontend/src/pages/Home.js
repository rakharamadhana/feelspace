import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const Home = () => {
    return (
        <FadeIn>
        <div className="min-h-screen flex flex-col lg:flex-row xl:flex-row items-center justify-between bg-[#fff4e3]">
            {/* Left Section - Text and Button */}
            <div className="flex flex-col justify-center items-center lg:items-start xl:items-start w-full lg:w-1/2 xl:w-1/2 px-6 py-12 lg:py-16 xl:py-20 lg:px-12 xl:px-16">
                <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-orange-600 mb-4 lg:mb-6 xl:mb-8">
                    玩轉情緒學習平台
                </h1>
                <h2 className="text-2xl lg:text-4xl xl:text-5xl font-semibold text-gray-800 mb-8 lg:mb-10 xl:mb-12">
                    FeelSpace Navigator
                </h2>
                <Link
                    to="/login"
                    className="bg-orange-500 text-white text-lg lg:text-2xl xl:text-3xl font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-orange-700 transition duration-300"
                >
                    登入
                </Link>
            </div>
            {/* Right Section - Image */}
            <div className="w-full lg:w-1/2 xl:w-1/2 flex justify-center lg:justify-end xl:justify-end items-center overflow-hidden">
                <img
                    src={`${process.env.PUBLIC_URL}/assets/home-bg.png`}
                    alt="FeelSpace Navigator"
                    className="w-64 lg:w-[35rem] xl:w-[50rem] h-auto object-cover"
                />
            </div>
        </div>
        </FadeIn>
    );
};

export default Home;
