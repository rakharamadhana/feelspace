import React from 'react';

const StoryTitleBox = ({ title, borderColor, textColor, bgColor }) => {
    return (
        <div
            className={`p-4 rounded-full border-4 ${borderColor} ${textColor} ${bgColor} text-center w-48 max-w-6xl mx-auto mb-6`}
        >
            <h4 className="text-xl font-semibold">
                {title}
            </h4>
        </div>
    );
};

export default StoryTitleBox;
