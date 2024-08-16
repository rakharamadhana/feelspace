import React, { useState } from 'react';

const ConclusionInterface = ({ previousAnswers, character, onBackClick, onSaveClick }) => {
    const [conclusionAnswer, setConclusionAnswer] = useState('');

    const conclusionQuestion = character === 'XiaoLi'
        ? '請試著用剛剛學到的非暴力溝通技巧，想想看如果你是小李，你會如何向媽媽表達呢？'
        : '請試著用剛剛學到的非暴力溝通技巧，想想看如果你是媽媽，你會如何向小李表達呢？';

    return (
        <div className="flex flex-col lg:flex-row w-full max-w-6xl space-y-6 lg:space-y-0 lg:space-x-6">
            {/* Left Card: Previous Answers */}
            <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg h-96 overflow-y-auto">
                <div className="text-left text-lg lg:text-xl space-y-2">
                    <div className="flex flex-col">
                        <strong>情緒選擇:</strong>
                        <span>{previousAnswers.selectedEmotion}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong>理由:</strong>
                        <span>{previousAnswers.reasoning}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong>觀察:</strong>
                        <span>{previousAnswers.observe}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong>感受:</strong>
                        <span>{previousAnswers.feeling}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong>需要:</strong>
                        <span>{previousAnswers.need}</span>
                    </div>
                    <div className="flex flex-col">
                        <strong>請求:</strong>
                        <span>{previousAnswers.request}</span>
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
                        value={conclusionAnswer}
                        onChange={(e) => setConclusionAnswer(e.target.value)}
                        rows="4"
                        style={{resize: "none"}}
                    ></textarea>
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBackClick}
                        className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transition duration-300 text-lg lg:text-xl"
                    >
                        返回
                    </button>
                    <button
                        onClick={() => onSaveClick(conclusionAnswer)}
                        className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 text-lg lg:text-xl"
                    >
                        完成
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConclusionInterface;
