import React from 'react';

const CaseTitle = ({ title, subtitle }) => {
    return (
        <div className="w-full max-w-6xl text-center my-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-black mb-4">{title}</h2>
        </div>
    );
};

export default CaseTitle;
