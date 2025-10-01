import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FadeIn from "../components/FadeIn";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import Notification from "../components/Notification"; // Import your custom axios instance

const CardMakerCreate = () => {
    const role = localStorage.getItem('role');
    const navigate = useNavigate();
    const [text, setText] = useState('');
    const [title, setTitle] = useState('事件卡');
    const [error, setError] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');
    const [userCards, setUserCards] = useState([]); // State to store user cards

    useEffect(() => {
        // Fetch user cards when the component mounts
        fetchUserCards();

        // Get the notification object from localStorage
        const notificationData = localStorage.getItem('notification');

        if (notificationData) {
            const { message, type } = JSON.parse(notificationData); // Parse the JSON string
            setNotificationMessage(message);
            setNotificationType(type || 'success'); // Default to 'success' if no type is provided
            localStorage.removeItem('notification'); // Clear notification after displaying it
        }
    }, []);

    // Fetch user cards when the component mounts
    const fetchUserCards = () => {
        const token = localStorage.getItem('token');
        api.get('/cards', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setUserCards(response.data); // Store cards in state
            })
            .catch(error => {
                console.error('Error fetching user cards:', error);
            });
    };

    const handleDeleteCard = (cardId) => {
        const token = localStorage.getItem('token');

        if (!window.confirm('Are you sure you want to delete this card?')) {
            return; // If user cancels, do nothing
        }

        api.delete(`/cards/delete/${cardId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Card deleted successfully:', response.data);
                // Remove the deleted card from the state to update the UI
                setUserCards(userCards.filter(card => card.id !== cardId));
            })
            .catch(error => {
                console.error('Error deleting card:', error);
            });
    };

    const handleCloseNotification = () => {
        setNotificationMessage(''); // Clear the notification message
        setNotificationType(''); // Clear the notification type
    };

    const isChinese = (char) => /[\u4e00-\u9fa5]/.test(char);

    const handleChange = (e) => {
        const inputText = e.target.value;
        let chineseCharCount = 0;
        let englishWordCount = 0;

        // Count Chinese characters and words separately
        for (let i = 0; i < inputText.length; i++) {
            if (isChinese(inputText[i])) {
                chineseCharCount++;
            }
        }

        englishWordCount = inputText
            .split(/\s+/)
            .filter(word => /^[a-zA-Z]+$/.test(word)) // only pure English words
            .length;

        // Apply rules
        if (chineseCharCount > 200) {
            setError('您只能輸入最多200個漢字');
            return;
        }

        if (englishWordCount > 10) {
            setError('You can only enter up to 10 English words.');
            return;
        }

        // ✅ Both conditions satisfied
        setText(inputText);
        setError('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
        if (file) {
            if (file instanceof File && file.type.startsWith('image/')) {
                setImageFile(file); // Store the original File object
                const reader = new FileReader();
                reader.onload = () => {
                    setImagePreview(reader.result); // Set the Data URL for preview
                };
                reader.readAsDataURL(file);
            } else {
                console.error('The selected file is not a valid image.');
                setError('Please select a valid image file.');
            }
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
        if ( !imageFile || !text ) {
            setError('All fields are required.');
            return;
        }

        // Check if the image is a File object
        if (!(imageFile instanceof File)) {
            console.error('Image is not a valid File object');
            setError('Image is not a valid file.');
            return;
        }

        const formData = new FormData();

        // Get the current date
        const now = new Date();

        // Extract individual components
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Format the date and time as "YYYYMMDD-HHMMSS"
        const creationDate = `${year}${month}${day}-${hours}${minutes}${seconds}`;

        // Create the title with the format "事件卡-<creationdate>"
        const title = `事件卡-${creationDate}`;

        formData.append('title', title); // Ensure this is the original file object
        formData.append('image', imageFile); // Ensure this is the original file object
        formData.append('description', text);

        // Get the token from localStorage
        const token = localStorage.getItem('token');

        api.post('/cards/save', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` // Only set the Authorization header
            }
        })
            .then(response => {
                console.log('Card saved successfully:', response.data);

                // Set notification directly in state
                setNotificationMessage(response.data.message);
                setNotificationType('success');

                // Refresh the list of cards after a successful save
                fetchUserCards();

                // Clear the form fields after saving
                setText('');
                setImageFile(null);
                setImagePreview(null);
            })
            .catch(error => {
                console.error('Error saving card:', error);
                setError('There was an error saving the card. Please try again.');
            });

        // Optionally, generate the card image locally and download it
        generateCardImage(title, text, imagePreview); // Ensure this function handles image generation and download
    };

    // Function to generate and download the card image
    const generateCardImage = (title, text, imageSrc) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = 1000;
        canvas.height = 1553;

        // Load template background first
        const template = new Image();
        template.src = process.env.PUBLIC_URL + "/assets/card-template.png";

        template.onload = () => {
            ctx.drawImage(template, 0, 0, canvas.width, canvas.height);

            // === IMAGE (no border, just rounded corners) ===
            const imageCornerRadius = 20;
            const imageWidth = 800;
            const imageHeight = 601;
            const imageX = (canvas.width - imageWidth) / 2;
            const imageY = 280; // ⬅️ moved further down from header

            ctx.save();
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
            ctx.clip();

            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageSrc;

            img.onload = () => {
                const imageAspectRatio = img.width / img.height;
                const frameAspectRatio = imageWidth / imageHeight;
                let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

                if (imageAspectRatio > frameAspectRatio) {
                    sourceWidth = img.height * frameAspectRatio;
                    sourceX = (img.width - sourceWidth) / 2;
                } else {
                    sourceHeight = img.width / frameAspectRatio;
                    sourceY = (img.height - sourceHeight) / 2;
                }

                ctx.drawImage(
                    img,
                    sourceX, sourceY,
                    sourceWidth, sourceHeight,
                    imageX, imageY,
                    imageWidth, imageHeight
                );
                ctx.restore();

                // === DESCRIPTION TEXT (no box, directly on card) ===
                ctx.font = "38px Arial"; // ⬅️ larger text
                ctx.fillStyle = "#000";
                ctx.textAlign = "left";
                ctx.textBaseline = "top";

                const descX = 100; // margin
                const descY = imageY + imageHeight + 50; // ⬅️ extra gap below image
                const descWidth = canvas.width - 200;

                const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
                    const paragraphs = text.split(/\n/);
                    let yOffset = 0;

                    paragraphs.forEach((para) => {
                        let words = para.split(""); // Chinese: per char
                        let line = "";

                        for (let i = 0; i < words.length; i++) {
                            let testLine = line + words[i];
                            let testWidth = context.measureText(testLine).width;

                            if (testWidth > maxWidth && i > 0) {
                                context.fillText(line, x, y + yOffset);
                                line = words[i];
                                yOffset += lineHeight;
                            } else {
                                line = testLine;
                            }
                        }
                        context.fillText(line, x, y + yOffset);
                        yOffset += lineHeight * 1.5;
                    });
                };

                wrapText(ctx, text, descX, descY, descWidth, 50);

                // === SAVE FILE ===
                canvas.toBlob((blob) => {
                    const downloadLink = document.createElement("a");
                    downloadLink.download = `${title}.png`;
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.click();
                }, "image/png");
            };

            img.onerror = () => console.error("Image loading failed.");
        };

        template.onerror = () => console.error("Template image loading failed.");
    };



    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <Notification message={notificationMessage} type={notificationType} onClose={handleCloseNotification} />
            <div className="flex-grow flex flex-col items-center justify-center text-black px-4">
                <FadeIn>
                    <h1 className="text-3xl md:text-5xl lg:text-7xl text-center font-bold mb-3">卡牌創作</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-400 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-500 transform hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-md md:text-lg lg:text-xl mb-3"
                    >
                        返回
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-6xl mx-auto">
                        {/* Card Creation Form with template overlay */}
                        <div className="relative w-[500px] h-[776px] mx-auto">
                            {/* Template background */}
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/card-template.png`}
                                alt="Card template"
                                className="absolute top-0 left-0 w-full h-full pointer-events-none select-none"
                            />

                            {/* Image upload slot */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-[130px] w-[400px] h-[300px] rounded-xl border-2 border-dashed border-gray-400 flex items-center justify-center bg-white/70 overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover" />
                                ) : (
                                    <label className="flex flex-col items-center justify-center cursor-pointer text-gray-600">
                                        <span>上傳圖片</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                    </label>
                                )}
                            </div>

                            {/* Description textarea */}
                            <textarea
                                className="absolute left-[50px] right-[50px] bottom-[100px] h-[200px] bg-transparent resize-none outline-none text-lg text-black"
                                placeholder="輸入發想衝突故事"
                                value={text}
                                onChange={handleChange}
                            />

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                className="absolute bottom-[20px] left-1/2 -translate-x-1/2 bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-orange-600 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-md"
                            >
                                保存卡片/下載
                            </button>
                        </div>

                        {/* User's Created Cards Table */}
                        <div className="flex-1 bg-white rounded-lg shadow-lg mb-3">
                            <div className="overflow-y-auto h-[51rem]">
                                {/* Combined table for header and body */}
                                <table className="min-w-full">
                                    <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">標題</th>
                                        <th className="py-2 px-4 border-b">描述</th>
                                        <th className="py-2 px-4 border-b">圖片</th>
                                        <th className="py-2 px-4 border-b">操作</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {userCards.map((card, index) => (
                                        <tr key={index} className="h-[8rem]"> {/* Set each row to have a fixed height */}
                                            <td className="py-2 px-4 border-b text-center max-w-xs truncate" title={card.title}>
                                                {card.title.length > 5 ? `${card.title.substring(0, 5)}...` : card.title}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center max-w-xs truncate" title={card.description}>
                                                {card.description.length > 5 ? `${card.description.substring(0, 5)}...` : card.description}
                                            </td>
                                            <td className="py-2 px-4 border-b text-center w-[10rem]">
                                                <img
                                                    src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${card.image_path}`}
                                                    alt={card.title}
                                                    className="w-16 h-16 object-cover mx-auto"
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b text-center w-[3rem]">
                                                <div className="inline-flex -space-x-0.5 justify-center">
                                                    <button
                                                        onClick={() =>
                                                            generateCardImage(
                                                                card.title,
                                                                card.description,
                                                                `${process.env.REACT_APP_IMAGE_BASE_URL}/${card.image_path}`
                                                            )
                                                        }
                                                        className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600 flex items-center justify-center"
                                                    >
                                                        <FontAwesomeIcon icon={faDownload}/>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCard(card.id)}
                                                        className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 flex items-center justify-center"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash}/>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default CardMakerCreate;
