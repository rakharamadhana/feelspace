import React from 'react';
import { useNavigate } from 'react-router-dom';

const StoryTitleBox = ({ title, borderColor, textColor, bgColor, backButton }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-6xl relative">
            {backButton && ( // Conditionally render the button if backButton prop is true
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl mb-3"
                >
                    返回
                </button>
            )}
            <div
                className={`p-4 rounded-full border-4 ${borderColor} ${textColor} ${bgColor} text-center w-48 max-w-6xl mx-auto ml-0 mb-6`}
            >
                <h4 className="text-3xl font-semibold">
                    {title}
                </h4>
            </div>
        </div>
    );
};

export default StoryTitleBox;
