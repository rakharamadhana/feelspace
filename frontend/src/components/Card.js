import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ imageUrl, text, bgColor, borderColor, textColor, link, simple, target = '_self' }) => {
    const isExternalLink = target === '_blank';

    // Add responsive classes dynamically
    const cardClasses = `max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 
                         rounded-3xl overflow-hidden shadow-lg 
                         hover:bg-opacity-80 hover:scale-105 active:scale-95 
                         transition duration-300 ease-in-out cursor-pointer 
                         disable-hover-on-touch ${simple ? `border-8 ${borderColor}` : bgColor}`;

    const contentClasses = `flex flex-col items-center 
                            p-4 sm:p-5 md:p-6 lg:p-8 
                            ${simple ? 'bg-white' : bgColor} 
                            rounded-xl`;

    const textClasses = `text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 
                         font-bold text-center ${textColor}`;

    const imageClasses = `w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 
                          rounded-xl`;

    return (
        isExternalLink ? (
            <a
                href={link}
                target={target}
                rel="noopener noreferrer"
                className={cardClasses}
            >
                <div className={contentClasses}>
                    {simple ? (
                        <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center`}>
                            <div className={textClasses}>
                                {text}
                            </div>
                        </div>
                    ) : (
                        <>
                            <img
                                className={imageClasses}
                                src={imageUrl}
                                alt="Card Illustration"
                            />
                            <div className={`mt-2 sm:mt-3 md:mt-4 lg:mt-6 font-bold ${textClasses}`}>
                                {text}
                            </div>
                        </>
                    )}
                </div>
            </a>
        ) : (
            <Link
                to={link}
                className={cardClasses}
            >
                <div className={contentClasses}>
                    {simple ? (
                        <div className={`w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 flex items-center justify-center`}>
                            <div className={textClasses}>
                                {text}
                            </div>
                        </div>
                    ) : (
                        <>
                            <img
                                className={imageClasses}
                                src={imageUrl}
                                alt="Card Illustration"
                            />
                            <div className={`mt-2 sm:mt-3 md:mt-4 lg:mt-6 font-bold ${textClasses}`}>
                                {text}
                            </div>
                        </>
                    )}
                </div>
            </Link>
        )
    );
};

export default Card;
