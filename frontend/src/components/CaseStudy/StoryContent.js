import React from 'react';

const StoryContent = ({ story, character }) => {
    return (
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg h-max overflow-y-auto">
            <p className="text-lg lg:text-xl text-gray-800 break-words leading-loose lg:leading-[3rem]">
                {story}
            </p>
        </div>
    );
};

export default StoryContent;
