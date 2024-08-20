import React, { useState, useEffect } from 'react';

const EmotionSelection = ({ character, onBackClick, onNextClick, initialEmotion, initialReasoning }) => {
    const [selectedEmotion, setSelectedEmotion] = useState(initialEmotion || '');
    const [reasoning, setReasoning] = useState(initialReasoning || '');

    useEffect(() => {
        setSelectedEmotion(initialEmotion || '');
        setReasoning(initialReasoning || '');
    }, [initialEmotion, initialReasoning]);

    return (
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg">
            <p className="text-lg lg:text-xl font-semibold mb-2">
                以下哪一個情況最能描述{character.character_name}的情緒呢？
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Emotion options remain the same */}
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="emotion"
                        className="mr-2"
                        checked={selectedEmotion === 1}
                        onChange={() => setSelectedEmotion(1)}
                    />
                    <span className="text-2xl lg:text-3xl mr-2">😡</span>
                    <span className="text-lg lg:text-xl">生氣的</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="emotion"
                        className="mr-2"
                        checked={selectedEmotion === 2}
                        onChange={() => setSelectedEmotion(2)}
                    />
                    <span className="text-2xl lg:text-3xl mr-2">😔</span>
                    <span className="text-lg lg:text-xl">冤望的</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="emotion"
                        className="mr-2"
                        checked={selectedEmotion === 3}
                        onChange={() => setSelectedEmotion(3)}
                    />
                    <span className="text-2xl lg:text-3xl mr-2">😰</span>
                    <span className="text-lg lg:text-xl">焦急的</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="emotion"
                        className="mr-2"
                        checked={selectedEmotion === 4}
                        onChange={() => setSelectedEmotion(4)}
                    />
                    <span className="text-2xl lg:text-3xl mr-2">😭</span>
                    <span className="text-lg lg:text-xl">難過的</span>
                </label>
            </div>
            <p className="text-lg lg:text-xl font-semibold mt-6 mb-2">
                請問你從哪裡看出來的呢？
            </p>
            <textarea
                className="w-full h-24 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your answer..."
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                rows="4"
                style={{ resize: "none" }}  // This disables resizing if you want to keep the height fixed
            ></textarea>
            <div className="flex justify-between mt-1">
                <button
                    onClick={onBackClick}
                    className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                >
                    返回
                </button>
                <button
                    onClick={() => onNextClick({ selectedEmotion, reasoning })}
                    className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-600 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                >
                    下一個
                </button>
            </div>
        </div>
    );
};

export default EmotionSelection;
