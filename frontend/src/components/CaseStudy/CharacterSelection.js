import React from 'react';

const CharacterSelection = ({ onSelectCharacter }) => {
    return (
        <div className="flex space-x-6 mb-8">
            <button
                onClick={() => onSelectCharacter("XiaoLi")}
                className="bg-yellow-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 text-lg lg:text-xl"
            >
                如果我是小李
            </button>
            <button
                onClick={() => onSelectCharacter("Mother")}
                className="bg-yellow-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 text-lg lg:text-xl"
            >
                如果我是媽媽
            </button>
        </div>
    );
};

export default CharacterSelection;
