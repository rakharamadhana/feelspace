import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FadeIn from "../components/FadeIn";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const CardMakerCreate = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [title, setTitle] = useState(''); // New state for title
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const isChinese = (char) => /[\u4e00-\u9fa5]/.test(char);

    const handleChange = (e) => {
        const inputText = e.target.value;
        let chineseCharCount = 0;
        let isEnglish = false;

        for (let i = 0; i < inputText.length; i++) {
            if (isChinese(inputText[i])) {
                chineseCharCount++;
            } else if (/[a-zA-Z]/.test(inputText[i])) {
                isEnglish = true;
            }
        }

        if (chineseCharCount > 0 && isEnglish) {
            setError('You cannot mix Chinese characters with English words.');
        } else if (chineseCharCount > 0) {
            if (chineseCharCount <= 5) {
                setText(inputText);
                setError('');
            } else {
                setError('您只能輸入最多5個漢字');
            }
        } else if (isEnglish) {
            const wordCount = inputText.split(/\s+/).filter(word => word.length > 0).length;
            if (wordCount <= 10) {
                setText(inputText);
                setError('');
            } else {
                setError('You can only enter up to 10 words.');
            }
        } else {
            setText(inputText);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageUpload(e);
    };

    const handleSave = () => {
        if (!title || !image || !text) {
            setError('All fields are required.');
            return;
        }

        const cardData = {
            title,
            image,
            description: text
        };

        console.log("Saving card data:", cardData);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 600; // Match the card's width
        canvas.height = 800; // Match the card's height

        // Background
        ctx.fillStyle = "#fff4e3"; // Background color of the card
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.strokeStyle = "#6c757d"; // Border color
        ctx.lineWidth = 16; // Border width (match the CSS border-8)
        ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16); // Adjusting for the border

        // Title Background with Rounded Corners
        const cornerRadius = 25; // Adjust this value for more or less rounding
        const rectX = canvas.width / 2 - 150;
        const rectY = 20;
        const rectWidth = 300;
        const rectHeight = 50;

        ctx.beginPath();
        ctx.moveTo(rectX + cornerRadius, rectY);
        ctx.lineTo(rectX + rectWidth - cornerRadius, rectY);
        ctx.arcTo(rectX + rectWidth, rectY, rectX + rectWidth, rectY + cornerRadius, cornerRadius);
        ctx.lineTo(rectX + rectWidth, rectY + rectHeight - cornerRadius);
        ctx.arcTo(rectX + rectWidth, rectY + rectHeight, rectX + rectWidth - cornerRadius, rectY + rectHeight, cornerRadius);
        ctx.lineTo(rectX + cornerRadius, rectY + rectHeight);
        ctx.arcTo(rectX, rectY + rectHeight, rectX, rectY + rectHeight - cornerRadius, cornerRadius);
        ctx.lineTo(rectX, rectY + cornerRadius);
        ctx.arcTo(rectX, rectY, rectX + cornerRadius, rectY, cornerRadius);
        ctx.closePath();

        ctx.fillStyle = "#6c757d"; // Gray background for the title
        ctx.fill();

        // Title Text
        ctx.font = "30px Arial"; // Match the font and size
        ctx.fillStyle = "#fff"; // White text color
        ctx.textAlign = "center";
        ctx.fillText(cardData.title, canvas.width / 2, rectY + rectHeight / 1.5); // Adjust the position

        // Image Box with Rounded Corners
        const imageCornerRadius = 20; // Adjust this value for more or less rounding
        const imageX = 50;
        const imageY = 90;
        const imageWidth = canvas.width - 100;
        const imageHeight = 400;

        // Clip the image to the rounded rectangle
        ctx.beginPath();
        ctx.moveTo(imageX + imageCornerRadius, imageY);
        ctx.lineTo(imageX + imageWidth - imageCornerRadius, imageY);
        ctx.arcTo(imageX + imageWidth, imageY, imageX + imageWidth, imageY + imageCornerRadius, imageCornerRadius);
        ctx.lineTo(imageX + imageWidth, imageY + imageHeight - imageCornerRadius);
        ctx.arcTo(imageX + imageWidth, imageY + imageHeight, imageX + imageWidth - imageCornerRadius, imageY + imageHeight, imageCornerRadius);
        ctx.lineTo(imageX + imageCornerRadius, imageY + imageHeight);
        ctx.arcTo(imageX, imageY + imageHeight, imageX, imageY + imageHeight - imageCornerRadius, imageCornerRadius);
        ctx.lineTo(imageX, imageY + imageCornerRadius);
        ctx.arcTo(imageX, imageY, imageX + imageCornerRadius, imageY, imageCornerRadius);
        ctx.closePath();

        ctx.fillStyle = "#fff"; // White background for the image box
        ctx.fill();

        ctx.save();
        ctx.clip(); // Clip to the path created above

        // Draw the uploaded image inside the clipped area
        const img = new Image();
        img.src = cardData.image;

        img.onload = () => {
            const aspectRatio = img.width / img.height;
            const imgHeight = imageWidth / aspectRatio;
            ctx.drawImage(img, imageX, imageY, imageWidth, imgHeight);

            ctx.restore(); // Restore to previous state to draw the border

            // Draw the border around the image box
            ctx.strokeStyle = "#6c757d"; // Border color (same as the title background)
            ctx.lineWidth = 8; // Border width (match the CSS border-8)
            ctx.stroke(); // Stroke the rounded rectangle

            // Description Box with Rounded Corners
            const descCornerRadius = 20; // Adjust this value for more or less rounding
            const descX = 50;
            const descY = 510;
            const descWidth = canvas.width - 100;
            const descHeight = 150;

            ctx.beginPath();
            ctx.moveTo(descX + descCornerRadius, descY);
            ctx.lineTo(descX + descWidth - descCornerRadius, descY);
            ctx.arcTo(descX + descWidth, descY, descX + descWidth, descY + descCornerRadius, descCornerRadius);
            ctx.lineTo(descX + descWidth, descY + descHeight - descCornerRadius);
            ctx.arcTo(descX + descWidth, descY + descHeight, descX + descWidth - descCornerRadius, descY + descHeight, descCornerRadius);
            ctx.lineTo(descX + descCornerRadius, descY + descHeight);
            ctx.arcTo(descX, descY + descHeight, descX, descY + descHeight - descCornerRadius, descCornerRadius);
            ctx.lineTo(descX, descY + descCornerRadius);
            ctx.arcTo(descX, descY, descX + descCornerRadius, descY, descCornerRadius);
            ctx.closePath();

            ctx.fillStyle = "#fff"; // White background for the description
            ctx.fill();

            // Draw the border around the description box with rounded corners
            ctx.strokeStyle = "#6c757d"; // Border color (same as the title background)
            ctx.lineWidth = 8; // Border width (match the CSS border-8)
            ctx.stroke(); // Stroke the rounded rectangle

            // Description Text
            ctx.font = "20px Arial"; // Match the font and size
            ctx.fillStyle = "#000"; // Black text color
            ctx.textAlign = "center";
            ctx.fillText(cardData.description, canvas.width / 2, descY + descHeight / 2 + 10); // Centered text

            // Download the card as an image
            const link = document.createElement('a');
            link.download = `${cardData.title}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <div className="flex-grow flex flex-col items-center justify-center text-black">
                <FadeIn>
                    <h1 className="text-5xl lg:text-7xl xl:text-8xl text-center font-bold mb-3">卡牌創作</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transition duration-300 text-lg lg:text-xl mb-3"
                    >
                        返回
                    </button>

                    <div
                        className="mb-3 w-[97vw] max-w-[600px] h-[48rem] rounded-2xl overflow-hidden shadow-lg border-gray-500 border-8 bg-[#ffffff]">
                        {/* Title Input */}
                        <div className="w-full h-auto flex items-center justify-center">
                            <input
                                type="text"
                                className="text-center mt-5 text-2xl shadow-lg rounded-full px-1 py-2 bg-gray-500 text-white focus:outline-none"
                                placeholder="在此輸入您的卡片標題"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>

                        {/* Image Upload */}
                        <div
                            className={`relative w-[30rem] left-14 h-[28rem] top-8 border-gray-500 border-8 bg-white rounded-2xl flex items-center justify-center overflow-hidden ${isDragging ? 'bg-gray-200' : 'bg-white'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            {image ? (
                                <img src={image} alt="Uploaded" className="w-full h-full object-cover"/>
                            ) : (
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <span>上傳圖片</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">點擊此處或拖放圖片到此區域</p>
                                </label>
                            )}
                        </div>

                        {/* Textarea */}
                        <div
                            className="relative w-[30rem] left-14 h-40 -bottom-12 border-gray-500 border-8 bg-white rounded-2xl flex items-center justify-center">
                            <textarea
                                className="w-full h-full p-3 rounded-2xl focus:outline-none text-2xl text-center"
                                placeholder="輸入情緒/對應的顏色"
                                rows="4"
                                value={text}
                                onChange={handleChange}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            ></textarea>
                            {error && <p className="text-red-500 text-center">{error}</p>}
                        </div>
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleSave}
                            className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-orange-600 transition duration-300 text-lg lg:text-3xl"
                        >
                            保存卡片/下載
                        </button>
                    </div>

                </FadeIn>
            </div>
        </div>
    );
};

export default CardMakerCreate;
