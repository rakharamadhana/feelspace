import React from 'react';
import { Excalidraw } from "@excalidraw/excalidraw";
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import Navbar from '../components/Navbar';
import FadeIn from "../components/FadeIn";

const Draw = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();  // Initialize the useNavigate hook

    return (
        <div className="min-h-screen flex flex-col" style={{backgroundColor: '#fff4e3'}}>
            <Navbar role={role}/>
            <div className="flex-grow flex flex-col items-center justify-center text-black">
                <FadeIn>
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl text-center font-bold mb-3">繪圖板</h1>
                    <button
                        onClick={() => navigate(-1)}  // Use navigate(-1) to go back to the previous page
                        className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transition duration-300 text-lg lg:text-xl mb-3"
                    >
                        返回
                    </button>
                    <div style={{
                        width: "97vw",
                        maxWidth: "1200px",
                        height: "68vh",
                        boxSizing: "border-box",
                        borderRadius: "20px", // Add border-radius for rounded corners
                        overflow: "hidden", // Ensure content doesn't overflow the rounded corners
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Optional: Add shadow for better visual effect
                    }}>
                        <Excalidraw/>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default Draw;
