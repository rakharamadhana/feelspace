import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import Navbar from '../components/Navbar';
import CaseTitle from '../components/CaseStudy/CaseTitle';
import StoryTitleBox from '../components/CaseStudy/StoryTitleBox';
import StoryContent from '../components/CaseStudy/StoryContent';
import EmotionSelection from '../components/CaseStudy/EmotionSelection';
import ObserveInterface from '../components/CaseStudy/ObserveInterface';
import FeelingInterface from '../components/CaseStudy/FeelingInterface';
import DemandInterface from '../components/CaseStudy/DemandInterface';
import RequestInterface from '../components/CaseStudy/RequestInterface';
import ConclusionInterface from '../components/CaseStudy/ConclusionInterface';
import CharacterSelection from '../components/CaseStudy/CharacterSelection';
import FadeIn from '../components/FadeIn';  // Import the FadeIn component

const CaseStudyDetail = () => {
    const role = localStorage.getItem('role');
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [view, setView] = useState('emotionSelection');
    const [fadeRightCard, setFadeRightCard] = useState(true);

    const [previousAnswers, setPreviousAnswers] = useState({
        observe: '',
        feeling: '',
        need: '',
        request: ''
    });
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        setFadeRightCard(true);
    }, []);

    const handleCharacterClick = (character) => {
        setFadeRightCard(false);
        setTimeout(() => {
            setSelectedCharacter(character);
            setView('emotionSelection');
            setFadeRightCard(true);
        }, 300);
    };

    const handlePreviousClick = (currentAnswer) => {
        setFadeRightCard(false);
        setTimeout(() => {
            // Save the current answer before moving to the previous view
            if (view === 'observeInterface') {
                setPreviousAnswers(prev => ({ ...prev, observe: currentAnswer }));
            } else if (view === 'feelingInterface') {
                setPreviousAnswers(prev => ({ ...prev, feeling: currentAnswer }));
            } else if (view === 'demandInterface') {
                setPreviousAnswers(prev => ({ ...prev, need: currentAnswer }));
            } else if (view === 'requestInterface') {
                setPreviousAnswers(prev => ({ ...prev, request: currentAnswer }));
            } else if (view === 'conclusionInterface') {
                setPreviousAnswers(prev => ({ ...prev, conclusion: currentAnswer }));
            }
            setFadeRightCard(true);

            // Then change the view
            if (view === 'emotionSelection') {
                setSelectedCharacter(null);
            } else if (view === 'observeInterface') {
                setView('emotionSelection');
            } else if (view === 'feelingInterface') {
                setView('observeInterface');
            } else if (view === 'demandInterface') {
                setView('feelingInterface');
            } else if (view === 'requestInterface') {
                setView('demandInterface');
            } else if (view === 'conclusionInterface') {
                setView('requestInterface');
            }
            setFadeRightCard(true);
        }, 300);
    };

    const handleNextClick = (currentAnswer) => {
        setFadeRightCard(false);
        setTimeout(() => {
            // Save the current answer before moving to the next view
            if (view === 'emotionSelection') {
                setPreviousAnswers(prev => ({
                    ...prev,
                    selectedEmotion: currentAnswer.selectedEmotion,
                    reasoning: currentAnswer.reasoning
                }));
                setView('observeInterface');
            } else if (view === 'observeInterface') {
                setPreviousAnswers(prev => ({ ...prev, observe: currentAnswer }));
                setView('feelingInterface');
            } else if (view === 'feelingInterface') {
                setPreviousAnswers(prev => ({ ...prev, feeling: currentAnswer }));
                setView('demandInterface');
            } else if (view === 'demandInterface') {
                setPreviousAnswers(prev => ({ ...prev, need: currentAnswer }));
                setView('requestInterface');
            } else if (view === 'requestInterface') {
                setPreviousAnswers(prev => ({ ...prev, request: currentAnswer }));
                setView('conclusionInterface');
            }
            setFadeRightCard(true);
        }, 300);
    };

    const handleSaveClick = (conclusionAnswer) => {
        const finalData = {
            ...previousAnswers,
            conclusion: conclusionAnswer
        };
        // Save data logic here
        console.log('Saving data:', finalData); // Replace with actual save logic
        navigate('/case-study'); // Redirect after saving
    };

    return (
        <div className="min-h-screen flex flex-col" style={{backgroundColor: '#fff4e3'}}>
            <Navbar role={role}/>
            <FadeIn>
                <div className="flex flex-col items-center text-black">
                    {selectedCharacter ? (
                        <>
                            <CaseTitle title="案例探討"/>
                            <StoryTitleBox
                                title="案例一"
                                borderColor="border-red-300"
                                textColor="text-red-300"
                                bgColor="bg-white"
                            />
                            <div
                                className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8">
                                {view !== 'conclusionInterface' && (
                                    <StoryContent character={selectedCharacter}/>
                                )}
                                <div
                                    className={`flex-1 transition-opacity duration-300 ${
                                        fadeRightCard ? 'opacity-100' : 'opacity-0'
                                    }`}
                                >
                                    {view === 'emotionSelection' ? (
                                        <EmotionSelection
                                            character={selectedCharacter}
                                            onBackClick={handlePreviousClick}
                                            onNextClick={handleNextClick}
                                            initialEmotion={previousAnswers.selectedEmotion}
                                            initialReasoning={previousAnswers.reasoning}
                                        />
                                    ) : view === 'observeInterface' ? (
                                        <ObserveInterface
                                            character={selectedCharacter}
                                            onBackClick={handlePreviousClick}
                                            onNextClick={(text) => handleNextClick(text)}
                                            initialValue={previousAnswers.observe}
                                        />
                                    ) : view === 'feelingInterface' ? (
                                        <FeelingInterface
                                            character={selectedCharacter}
                                            onBackClick={handlePreviousClick}
                                            onNextClick={(text) => handleNextClick(text)}
                                            initialValue={previousAnswers.feeling}
                                        />
                                    ) : view === 'demandInterface' ? (
                                        <DemandInterface
                                            character={selectedCharacter}
                                            onBackClick={handlePreviousClick}
                                            onNextClick={(text) => handleNextClick(text)}
                                            initialValue={previousAnswers.need}
                                        />
                                    ) : view === 'requestInterface' ? (
                                        <RequestInterface
                                            character={selectedCharacter}
                                            onBackClick={handlePreviousClick}
                                            onNextClick={(text) => handleNextClick(text)}
                                            initialValue={previousAnswers.request}
                                        />
                                    ) : view === 'conclusionInterface' ? (
                                        <ConclusionInterface
                                            character={selectedCharacter}
                                            previousAnswers={previousAnswers}
                                            onBackClick={handlePreviousClick}
                                            onSaveClick={handleSaveClick}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <CaseTitle title="案例探討"/>
                            <StoryTitleBox
                                title="案例一"
                                borderColor="border-red-300"
                                textColor="text-red-300"
                                bgColor="bg-white"
                            />
                            <div
                                className={`flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8 transition-opacity duration-200 ${
                                    fadeRightCard ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <StoryContent character="initial"/>
                            </div>
                            <CharacterSelection onSelectCharacter={handleCharacterClick}/>
                        </>
                    )}
                </div>
            </FadeIn>
        </div>
    );
};

export default CaseStudyDetail;
