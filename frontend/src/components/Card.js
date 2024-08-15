import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ imageUrl, text, bgColor, borderColor, textColor, link, simple }) => {
    return (
        <Link
            to={link}
            className={`max-w-xs md:max-w-sm lg:max-w-md rounded-xl overflow-hidden shadow-lg hover:bg-opacity-80 transition duration-300 cursor-pointer ${simple ? `border-8 ${borderColor}` : bgColor}`}
        >
            <div className={`flex flex-col items-center p-4 md:p-6 lg:p-8 ${simple ? 'bg-white' : bgColor} rounded-xl`}>
                {simple ? (
                    <div className="w-32 h-32 md:w-48 md:h-48 lg:w-60 lg:h-60 xl:w-72 xl:h-72 flex items-center justify-center">
                        <div className={`text-2xl md:text-4xl lg:text-5xl font-bold text-center ${textColor}`}>
                            {text}
                        </div>
                    </div>
                ) : (
                    <>
                        <img
                            className="w-48 h-48 md:w-60 md:h-60 lg:w-72 lg:h-72 rounded-xl"
                            src={imageUrl}
                            alt="Card image"
                        />
                        <div className={`mt-4 md:mt-6 lg:mt-8 font-bold text-2xl md:text-4xl lg:text-5xl text-center ${textColor}`}>
                            {text}
                        </div>
                    </>
                )}
            </div>
        </Link>
    );
};

export default Card;
