// src/pages/StudentWhiteboard.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FadeIn from "../components/FadeIn";

export default function StudentWhiteboard() {
    const location = useLocation();
    const navigate = useNavigate();

    const whiteboardLink = location.state?.link || "https://example.com";
    const role = localStorage.getItem("role");

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ backgroundColor: "#fff4e3" }}
        >
            {/* Navbar/Header */}
            <Navbar role={role} />

            <div className="flex-grow flex flex-col items-center justify-center text-black px-4">
                <FadeIn>
                    {/* Title */}
                    <h1 className="text-3xl md:text-5xl lg:text-7xl text-center font-bold mb-3">
                        衝突事件分析
                    </h1>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transform hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-md md:text-lg lg:text-xl mb-3"
                    >
                        返回
                    </button>
                </FadeIn>

                {/* Whiteboard container (always visible, not wrapped in FadeIn) */}
                <div className="w-[90%] h-[90vh] bg-white rounded-xl shadow-lg overflow-hidden">
                    <iframe
                        src={whiteboardLink}
                        title="Student Whiteboard"
                        allowFullScreen
                        className="w-full h-full border-0"
                    />
                </div>
            </div>
        </div>
    );
}
