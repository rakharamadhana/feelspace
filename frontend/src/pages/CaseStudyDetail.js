import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import FadeIn from '../components/FadeIn';
import api from '../api';

const CaseStudyDetail = () => {
    const { id } = useParams();
    const [caseDetails, setCaseDetails] = useState(null);
    const [characters, setCharacters] = useState([]); // State to store character data
    const role = localStorage.getItem('role');
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [view, setView] = useState('emotionSelection');
    const [fadeRightCard, setFadeRightCard] = useState(true);
    const [previousAnswers, setPreviousAnswers] = useState({
        observe: '',
        feeling: '',
        need: '',
        request: '',
        selectedEmotion: '',
        reasoning: '',
        conclusion: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        setFadeRightCard(true);

        // Get the token from localStorage
        const token = localStorage.getItem('token');

        // Fetch the case details
        api.get(`/cases/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setCaseDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching case details:', error);
            });

        // Fetch the characters for this case
        api.get(`/cases/${id}/characters`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setCharacters(response.data); // Set the character data
            })
            .catch(error => {
                console.error('Error fetching characters:', error);
            });

        // Fetch the user's previous answers for this case and character
        if (selectedCharacter) {
            api.get(`/cases/details/${id}/${selectedCharacter.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.data) {
                        setPreviousAnswers({
                            observe: response.data.observe,
                            feeling: response.data.feeling,
                            need: response.data.need,
                            request: response.data.request,
                            selectedEmotion: response.data.emotion,
                            reasoning: response.data.reasoning,
                            conclusion: response.data.conclusion
                        });
                    } else {
                        // If no previous answers, reset to default values
                        setPreviousAnswers({
                            observe: '',
                            feeling: '',
                            need: '',
                            request: '',
                            selectedEmotion: '',
                            reasoning: '',
                            conclusion: ''
                        });
                    }
                })
                .catch(error => {
                    console.error('Error fetching previous answers:', error);
                });
        }

    }, [id, selectedCharacter]); // Add selectedCharacter as a dependency

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
            case_id: id,
            character_id: selectedCharacter.id,
            emotion: previousAnswers.selectedEmotion,
            observe: previousAnswers.observe,
            feeling: previousAnswers.feeling,
            need: previousAnswers.need,
            request: previousAnswers.request,
            reasoning: previousAnswers.reasoning,
            conclusion: conclusionAnswer
        };

        const token = localStorage.getItem('token');

        api.post(`/cases/details/${id}/${selectedCharacter.id}/save`, finalData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Data saved successfully:', response.data);

                // Store both the message and type in one line
                localStorage.setItem('notification', JSON.stringify({ message: response.data, type: 'success' }));

                navigate('/case-study');
            })
            .catch(error => {
                console.error('Error saving data:', error);
            });
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <FadeIn>

                <div className="flex flex-col items-center text-black mx-3">
                    {caseDetails ? (
                        <>
                            {selectedCharacter ? (
                                <>

                                    <CaseTitle title="案例探討"/>
                                    <StoryTitleBox
                                        title={caseDetails.title}
                                        borderColor={caseDetails.borderColor}
                                        textColor={caseDetails.textColor}
                                        bgColor="bg-white"
                                    />
                                    <div
                                        className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8">
                                        {view !== 'conclusionInterface' && (
                                            <StoryContent
                                                character={selectedCharacter}
                                                story={caseDetails.story}
                                            />
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
                                        title={caseDetails.title}
                                        borderColor={caseDetails.borderColor}
                                        textColor={caseDetails.textColor}
                                        bgColor="bg-white"
                                    />
                                    <div
                                        className={`flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8 transition-opacity duration-200 ${
                                            fadeRightCard ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        <StoryContent
                                            character="initial"
                                            story={caseDetails.story}
                                        />
                                    </div>
                                    <CharacterSelection
                                        onSelectCharacter={handleCharacterClick}
                                        characters={characters} // Pass the character data to the component
                                    />

                                </>
                            )}
                        </>
                    ) : (
                        <>
                            <CaseTitle title="Loading..."/>
                            <StoryTitleBox
                                title="Loading"
                                borderColor="border-gray-300"
                                textColor="text-gray-300"
                                bgColor="bg-white"
                            />
                            <div
                                className={`flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6 mb-8 transition-opacity duration-200 ${
                                    fadeRightCard ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <StoryContent/>
                            </div>
                        </>
                    )}
                </div>
            </FadeIn>
        </div>
    );
};

export default CaseStudyDetail;
