import React from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FadeIn from "../components/FadeIn";

const CaseStudy = () => {
    const role = localStorage.getItem('role');

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <div className="flex-grow flex flex-col items-center justify-center text-black">
                <FadeIn>
                <h1 className="text-6xl lg:text-8xl xl:text-9xl text-center font-bold mb-16">案例探討</h1>
                <div className="flex space-x-6">
                    <Card imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`} text="案例一"
                          borderColor="border-red-300" textColor="text-red-300" link="/case-study/detail" simple={true}/>
                    <Card imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`} text="案例二"
                          borderColor="border-blue-300" textColor="text-blue-300" link="#" simple={true}/>
                    <Card imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`} text="案例三"
                          borderColor="border-green-300" textColor="text-green-300" link="#" simple={true}/>
                </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default CaseStudy;
