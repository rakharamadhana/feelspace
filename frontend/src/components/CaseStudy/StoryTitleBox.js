import React from 'react';

const StoryTitleBox = ({ title, borderColor, textColor, bgColor }) => {
    return (
        <div className="w-full max-w-6xl text-center">
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
