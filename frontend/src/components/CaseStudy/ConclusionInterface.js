import React, { useState } from 'react';

const ConclusionInterface = ({ previousAnswers, character, onBackClick, onSaveClick }) => {
    const [conclusionText, setConclusionText] = useState(previousAnswers.conclusion || '');

    // Use the character's name dynamically in the conclusion question
    const conclusionQuestion = `請試著用剛剛學到的非暴力溝通技巧，想想看如果你是${character.character_name}，你會如何表達呢？`;

    return (
        <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Left Card: Previous Answers */}
            <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg h-96 overflow-y-auto">
                <div className="text-left text-lg lg:text-xl space-y-2 font-semibold">
                    {/* Two-column container */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {/* Column 1 */}
                        <div className="flex flex-col">
                            <span className="text-orange-500 lg:text-3xl">情緒選擇:</span>
                            {(() => {
                                switch (previousAnswers.selectedEmotion) {
                                    case '生氣的':
                                        return (
                                            <span className="inline-flex items-center">
                                    <span className="text-2xl lg:text-3xl">😡</span>
                                    <span className="text-lg lg:text-xl">生氣的</span>
                                </span>
                                        );
                                    case '冤枉的':
                                        return (
                                            <span className="inline-flex items-center">
                                    <span className="text-2xl lg:text-3xl">😔</span>
                                    <span className="text-lg lg:text-xl">冤枉的</span>
                                </span>
                                        );
                                    case '焦急的':
                                        return (
                                            <span className="inline-flex items-center">
                                    <span className="text-2xl lg:text-3xl">😰</span>
                                    <span className="text-lg lg:text-xl">焦急的</span>
                                </span>
                                        );
                                    case '難過的':
                                        return (
                                            <span className="inline-flex items-center">
                                    <span className="text-2xl lg:text-3xl">😭</span>
                                    <span className="text-lg lg:text-xl">難過的</span>
                                </span>
                                        );
                                    default:
                                        return (
                                            <span className="inline-flex items-center">
                                    <span className="text-lg lg:text-xl">{previousAnswers.selectedEmotion}</span>
                                </span>
                                        );
                                }
                            })()}
                        </div>

                        <div className="flex flex-col">
                            <span className="text-orange-500 lg:text-3xl">理由:</span>
                            <span>{previousAnswers.reasoning}</span>
                        </div>

                        {/* Column 2 */}
                        <div className="flex flex-col">
                            <span className="text-orange-500 lg:text-3xl">觀察:</span>
                            <span>{previousAnswers.observe}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-orange-500 lg:text-3xl">感受:</span>
                            <span>{previousAnswers.feeling}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-orange-500 lg:text-3xl">需要:</span>
                            <span>{previousAnswers.need}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-orange-500 lg:text-3xl">請求:</span>
                            <span>{previousAnswers.request}</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Right Card: Conclusion Question and Input */}
            <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg justify-between">
                <div className="mt-1">
                    <p className="text-lg lg:text-xl font-semibold mb-4">{conclusionQuestion}</p>
                    <textarea
                        className="w-full h-36 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        placeholder="Enter your answer..."
                        value={conclusionText}
                        onChange={(e) => setConclusionText(e.target.value)}
                        rows="4"
                        style={{resize: "none"}}
                    ></textarea>
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={() => onBackClick(conclusionText)}
                        className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                    >
                        返回
                    </button>
                    <button
                        onClick={() => onSaveClick(conclusionText)}
                        className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-600 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                    >
                        儲存
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConclusionInterface;
