import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import CaseTitle from '../components/CaseStudy/CaseTitle';
import StoryTitleBox from '../components/CaseStudy/StoryTitleBox';
import StoryContent from '../components/CaseStudy/StoryContent';
import EmotionSelection from '../components/CaseStudy/EmotionSelection';
import CharacterSelection from '../components/CaseStudy/CharacterSelection';
import NavigationButtons from '../components/CaseStudy/NavigationButtons';

const CaseStudyDetail = () => {
    const role = localStorage.getItem('role');
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        setFade(true);  // Ensure fade is true on the first render
    }, []);

    const handleCharacterClick = (character) => {
        setFade(false);
        setTimeout(() => {
            setSelectedCharacter(character);
            setFade(true);
        }, 300);  // Adjust the delay to match your transition duration
    };

    const handlePreviousClick = () => {
        setFade(false);
        setTimeout(() => {
            setSelectedCharacter(null); // Reset to character selection
            setFade(true);
        }, 300);
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <div className="flex flex-col items-center text-black">
                {selectedCharacter ? (
                    <>
                        <CaseTitle title="案例探討" />
                        <StoryTitleBox
                            title="案例一"
                            borderColor="border-red-500" // Customize the border color
                            textColor="text-red-500" // Customize the text color
                            bgColor="bg-white"
                        />
                        <div
                            className={`flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8 transition-opacity duration-500 ${
                                fade ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <StoryContent character={selectedCharacter} />
                            <EmotionSelection character={selectedCharacter} />
                        </div>
                        <NavigationButtons
                            onPreviousClick={handlePreviousClick}
                            onNextClick={() => {}}
                        />
                    </>
                ) : (
                    <>
                        <CaseTitle title="案例探探討" />
                        <div
                            className={`flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8 transition-opacity duration-500 ${
                                fade ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <StoryContent character="initial" />
                        </div>
                        <CharacterSelection onSelectCharacter={handleCharacterClick} />
                    </>
                )}
            </div>
        </div>
    );
};

export default CaseStudyDetail;
