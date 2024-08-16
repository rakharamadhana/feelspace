import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FadeIn from "../components/FadeIn";

const StudentDashboard = () => {
    const role = localStorage.getItem('role');

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <FadeIn>
                <div className="flex-grow flex flex-col items-center justify-center text-black">
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold mb-16">首頁</h1>
                    <div className="flex space-x-6">
                        <Card imageUrl={`${process.env.PUBLIC_URL}/assets/menu-1.png`} text="案例探討" bgColor="bg-red-300" textColor="text-white" link="/case-study" />
                        <Card imageUrl={`${process.env.PUBLIC_URL}/assets/menu-2.png`} text="桌遊專區" bgColor="bg-blue-300" textColor="text-white" link="https://playingcards.io/aqwqfg" />
                        <Card imageUrl={`${process.env.PUBLIC_URL}/assets/menu-3.png`} text="卡牌創作" bgColor="bg-green-300" textColor="text-white" link="/card-maker" />
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default StudentDashboard;
