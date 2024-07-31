import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ imageUrl, text, bgColor, borderColor, textColor, link, simple }) => {
    return (
        <Link to={link} className={`max-w-sm rounded-xl overflow-hidden shadow-lg hover:bg-opacity-80 transition duration-300 cursor-pointer ${simple ? `border-8 ${borderColor}` : bgColor}`}>
            <div className={`flex flex-col items-center p-6 ${simple ? 'bg-white' : bgColor} rounded-xl`}>
                {simple ? (
                    <div className="w-72 h-72 flex items-center justify-center">
                        <div className={`text-xl font-bold text-center ${textColor}`}>{text}</div>
                    </div>
                ) : (
                    <>
                        <img className="w-72 h-72 rounded-xl" src={imageUrl} alt="Card image" />
                        <div className={`mt-4 font-bold text-4xl text-center ${textColor}`}>{text}</div>
                    </>
                )}
            </div>
        </Link>
    );
};

export default Card;
