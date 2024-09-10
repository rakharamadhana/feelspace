import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FadeIn from "../components/FadeIn";

const CardMaker = () => {
    const role = localStorage.getItem('role');

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <div className="flex-grow flex flex-col items-center justify-center text-black">
                <FadeIn>
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl text-center font-bold mb-16">卡牌創作</h1>
                    <div className="flex space-x-6">
                        {role === 'Student-Ctrl' && (
                        <Card imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`} text="繪圖板"
                              borderColor="border-red-300" textColor="text-red-300" link="/card-maker/draw" simple={true}/>
                        )}
                        {role === 'Student-Exp' && (
                            <Card imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`} text="AI工具"
                                  borderColor="border-blue-300" textColor="text-blue-300" link="https://www.freepik.com/pikaso/ai-image-generator?style=noStyle&submit=1#from_element=landing_tti" target="_blank" simple={true}/>
                        )}
                        <Card imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`} text="卡牌製作"
                              borderColor="border-green-300" textColor="text-green-300" link="/card-maker/create" simple={true}/>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default CardMaker;
