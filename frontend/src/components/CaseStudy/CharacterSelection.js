import React from 'react';

const CharacterSelection = ({ onSelectCharacter, characters }) => {
    return (
        <div className="flex space-x-6 mb-8">
            {characters.map(character => (
                <button
                    key={character.id}
                    onClick={() => onSelectCharacter(character)}
                    className="bg-yellow-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-yellow-600 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                >
                    {`如果我是${character.character_name}`}
                </button>
            ))}
        </div>
    );
};

export default CharacterSelection;
