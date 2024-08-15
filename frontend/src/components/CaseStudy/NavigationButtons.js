import React from 'react';

const NavigationButtons = ({ onPreviousClick, onNextClick }) => {
    return (
        <div className="flex justify-between w-full max-w-6xl">
            {/* Previous Button */}
            <button
                onClick={onPreviousClick}
                className="bg-gray-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-600 transition duration-300 text-lg lg:text-xl"
            >
                上一步
            </button>

            {/* Next Button */}
            <button
                onClick={onNextClick}
                className="bg-yellow-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 text-lg lg:text-xl"
            >
                下一個
            </button>
        </div>
    );
};

export default NavigationButtons;
