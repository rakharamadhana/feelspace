import React, { useState, useEffect } from 'react';

const DemandInterface = ({ character, onBackClick, onNextClick, initialValue }) => {
    const [demandText, setDemandText] = useState(initialValue || '');

    useEffect(() => {
        setDemandText(initialValue || '');
    }, [initialValue]);

    let demandQuestion = '';

    if (character === 'Mother') {
        demandQuestion = '如果你是媽媽，該如何運用非暴力溝通的「需要」說明自己情緒的狀況呢？';
    } else if (character === 'XiaoLi') {
        demandQuestion = '如果你是小李，該如何運用非暴力溝通的「需要」說明自己情緒的狀況呢？';
    }

    return (
        <div className="flex-1 bg-white p-6 rounded-3xl h-96 shadow-lg">
            <div className="flex justify-between text-xl lg:text-2xl mb-4">
                <span className="text-gray-500">觀察</span>
                <span className="text-gray-500">感受</span>
                <span className="text-orange-500">需要</span>
                <span className="text-gray-500">請求</span>
            </div>
            <p className="text-lg lg:text-xl font-semibold mb-4">
                {demandQuestion}
            </p>
            <textarea
                className="w-full h-36 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your answer..."
                value={demandText}
                onChange={(e) => setDemandText(e.target.value)}
                rows="4"
                style={{ resize: "none" }}
            ></textarea>
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => onBackClick(demandText)}
                    className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transition duration-300 text-lg lg:text-xl"
                >
                    返回
                </button>
                <button
                    onClick={() => onNextClick(demandText)}
                    className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-yellow-600 transition duration-300 text-lg lg:text-xl"
                >
                    下一個
                </button>
            </div>
        </div>
    );
};

export default DemandInterface;
