import React from 'react';
import { Link } from 'react-router-dom';
import FadeIn from '../components/FadeIn';

const Home = () => {
    return (
        <FadeIn>
            <div
                className="min-h-screen flex flex-col lg:flex-row xl:flex-row items-center justify-between bg-[#fff4e3]">
                {/* Left Section - Text and Button */}
                <div
                    className="flex flex-col justify-center items-center lg:items-center xl:items-center w-full lg:w-1/2 xl:w-1/2 px-6 py-12 lg:py-16 xl:py-20 lg:px-12 xl:px-16 z-10">
                    <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-orange-600 mb-4 lg:mb-6 xl:mb-8">
                        玩轉情緒學習平台
                    </h1>
                    <h2 className="text-2xl lg:text-4xl xl:text-5xl font-semibold text-gray-800 mb-10 lg:mb-12 xl:mb-14">
                        FeelSpace Navigator
                    </h2>
                    <Link
                        to="/login"
                        className="bg-orange-500 text-white text-lg lg:text-5xl xl:text-6xl font-bold py-6 px-10 rounded-full shadow-lg hover:bg-orange-700 transition duration-300"
                    >
                        登入
                    </Link>
                </div>
                <div
                    className="absolute w-full xl:w-[80rem] h-full xl:right-0 flex justify-center lg:justify-center xl:justify-center items-center overflow-hidden z-0">
                    <img
                        src={`${process.env.PUBLIC_URL}/assets/home-bg.png`}
                        alt="FeelSpace Navigator"
                        className="absolute w-[55rem] xl:w-[65rem] top-50 left-96 xl:left-96 z-0"
                    />
                </div>
            </div>
        </FadeIn>
    );
};

export default Home;
