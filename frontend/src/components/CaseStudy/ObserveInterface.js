import React, { useState, useEffect } from 'react';

const ObserveInterface = ({ character, onBackClick, onNextClick, initialValue }) => {
    const [observeText, setObserveText] = useState(initialValue || '');

    useEffect(() => {
        setObserveText(initialValue || '');
    }, [initialValue]);

    const observeQuestion = `如果你是${character.character_name}，該如何運用非暴力溝通的「觀察」說明自己情緒的狀況呢？`;

    return (
        <div className="flex-1 bg-white p-6 rounded-3xl h-max shadow-lg">
            <div className="flex items-center justify-between text-xl lg:text-2xl mb-4">
                <span className="text-orange-500 font-extrabold">觀察</span>
                <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
                <span className="text-gray-500">感受</span>
                <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
                <span className="text-gray-500">需要</span>
                <div className="flex-grow border-t-2 border-gray-300 mx-2"></div>
                <span className="text-gray-500">請求</span>
            </div>
            <p className="text-lg lg:text-xl font-semibold mb-4">
                {observeQuestion}
            </p>
            <p className="text-lg lg:text-xl font-semibold mb-2 text-orange-500">
                提示：我觀察/看到/聽到你.....
            </p>
            <textarea
                className="w-full h-36 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your answer..."
                value={observeText}
                onChange={(e) => setObserveText(e.target.value)}
                rows="4"
                style={{ resize: "none" }}
            ></textarea>
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => onBackClick(observeText)}
                    className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                >
                    返回
                </button>
                <button
                    onClick={() => onNextClick(observeText)}
                    className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-600 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-lg lg:text-xl"
                >
                    下一個
                </button>
            </div>
        </div>
    );
};

export default ObserveInterface;
