import React from 'react';

const StoryContent = ({ character }) => {
    let content = '';

    if (character === 'XiaoLi') {
        content = "小李是一位高二生，夢想成為一名技能競賽的國家代表隊。為此他內心充滿期待，每天花費許多時間訓練，但訓練及課業的雙向壓力讓他無法平衡。媽媽擔心他長時間的訓練會忽略課業，有一天對著回到家坐在沙發休息的小李說：「還不趕快去讀書，整天不知道在學校混什麼！」，小李聽到後回嘴說：「我有不讀書嗎？你又沒當過選手你懂什麼？」，並大聲地甩上房門不與媽媽交談。";
    } else if (character === 'Mother') {
        content = "小李是一位高二生，夢想成為一名技能競賽的國家代表隊。為此他內心充滿期待，每天花費許多時間訓練，但訓練及課業的雙向壓力讓他無法平衡。媽媽擔心他長時間的訓練會忽略課業，有一天對著回到家坐在沙發休息的小李說：「還不趕快去讀書，整天不知道在學校混什麼！」，小李聽到後回嘴說：「我有不讀書嗎？你又沒當過選手你懂什麼？」，並大聲地甩上房門不與媽媽交談。";
    } else {
        content = "小李是一位高二生，夢想成為一名技能競賽的國家代表隊。為此他內心充滿期待，每天花費許多時間訓練，但訓練及課業的雙向壓力讓他無法平衡。媽媽擔心他長時間的訓練會忽略課業，有一天對著回到家坐在沙發休息的小李說：「還不趕快去讀書，整天不知道在學校混什麼！」，小李聽到後回嘴說：「我有不讀書嗎？你又沒當過選手你懂什麼？」，並大聲地甩上房門不與媽媽交談。";
    }

    return (
        <div className="flex-1 bg-white p-6 rounded-3xl shadow-lg h-96 overflow-y-auto">
            <p className="text-lg lg:text-xl text-gray-800 leading-relaxed break-words">
                {content}
            </p>
        </div>
    );
};

export default StoryContent;
