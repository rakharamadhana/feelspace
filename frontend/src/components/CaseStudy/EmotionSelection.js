import React from 'react';

const EmotionSelection = ({ character }) => {
    return (
        <div className="flex-1 bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg lg:text-xl font-semibold mb-4">
                {character === "XiaoLi" ? "以下哪一個情況最能描述小李的情緒呢？" : "以下哪一個情況最能描述媽媽的情緒呢？"}
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {character === "XiaoLi" ? (
                    <>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😡</span>
                            <span className="text-lg lg:text-xl">生氣的</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😔</span>
                            <span className="text-lg lg:text-xl">冤望的</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😰</span>
                            <span className="text-lg lg:text-xl">焦急的</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😭</span>
                            <span className="text-lg lg:text-xl">難過的</span>
                        </label>
                    </>
                ) : (
                    <>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😡</span>
                            <span className="text-lg lg:text-xl">失望的</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😔</span>
                            <span className="text-lg lg:text-xl">冤望的</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😰</span>
                            <span className="text-lg lg:text-xl">焦急的</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="emotion" className="mr-2" />
                            <span className="text-2xl lg:text-3xl mr-2">😭</span>
                            <span className="text-lg lg:text-xl">難過的</span>
                        </label>
                    </>
                )}
            </div>
            <p className="text-lg lg:text-xl font-semibold mt-6 mb-4">
                請問你從哪裡看出來的呢？
            </p>
            <textarea
                className="w-full h-32 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter your answer..."
                rows="4"
                style={{resize: "none"}}  // This disables resizing if you want to keep the height fixed
            ></textarea>
        </div>
    );
};

export default EmotionSelection;
