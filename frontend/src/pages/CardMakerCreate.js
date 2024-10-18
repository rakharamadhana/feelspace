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
    const [title, setTitle] = useState('感受卡');
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

        // Create the title with the format "感受卡-<creationdate>"
        const title = `感受卡-${creationDate}`;

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
        const rectY = 25;
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
        ctx.fillText('感受卡', canvas.width / 2, rectY + rectHeight / 1.5); // Adjust the position

        // Image Box with Rounded Corners
        const imageCornerRadius = 15; // Adjust this value for more or less rounding
        const imageX = 50;
        const imageY = 90;
        const imageWidth = canvas.width - 100; // Define the box width for the image
        const imageHeight = 450; // Define the box height for the image

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
        img.crossOrigin = "anonymous"; // Add this line to ensure cross-origin image loading
        img.src = imageSrc;

        img.onload = () => {
            const imageAspectRatio = img.width / img.height;
            const frameAspectRatio = imageWidth / imageHeight;
            let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

            // If the image aspect ratio is greater than the frame, crop horizontally
            if (imageAspectRatio > frameAspectRatio) {
                // Image is wider than the frame, crop the sides
                sourceWidth = img.height * frameAspectRatio;
                sourceX = (img.width - sourceWidth) / 2; // Center the crop horizontally
            } else {
                // Image is taller than the frame, crop the top and bottom
                sourceHeight = img.width / frameAspectRatio;
                sourceY = (img.height - sourceHeight) / 2; // Center the crop vertically
            }

            // Draw the image, filling the entire frame and cropping the excess
            ctx.drawImage(
                img,
                sourceX, sourceY, // Start cropping from (sourceX, sourceY)
                sourceWidth, sourceHeight, // Crop dimensions
                imageX, imageY, // Destination position on the canvas
                imageWidth, imageHeight // Destination dimensions on the canvas
            );

            ctx.restore(); // Restore to previous state to draw the border

            // Draw the border around the image box
            ctx.strokeStyle = "#6c757d"; // Border color (same as the title background)
            ctx.lineWidth = 8; // Border width (match the CSS border-8)
            ctx.stroke(); // Stroke the rounded rectangle

            // Description Box with Rounded Corners
            const descCornerRadius = 15; // Adjust this value for more or less rounding
            const descX = 50;
            const descY = 575;
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
            ctx.fillText(text, canvas.width / 2, descY + descHeight / 2 + 10); // Centered text

            // Download the card as an image locally
            canvas.toBlob((blob) => {
                const downloadLink = document.createElement('a');
                downloadLink.download = `${title}.png`;
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.click();
            }, 'image/png');
        };

        img.onerror = () => {
            console.error('Image loading failed. Ensure the server has proper CORS headers.');
        };
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
                        {/* Card Creation Form */}
                        <div className="flex flex-col mb-3 w-full h-auto rounded-2xl overflow-hidden shadow-lg border-gray-500 border-8 bg-white px-4 py-4">
                            {/* Title Input */}
                            <input
                                type="text"
                                className="text-center mt-5 text-xl md:text-2xl shadow-lg rounded-full px-1 py-2 bg-gray-500 text-white focus:outline-none"
                                value={title} // The title state is set to "感受卡"
                                readOnly // Makes the input field uneditable by the user
                            />


                            {/* Image Upload */}
                            <div
                                className={`relative w-full h-96 mt-8 border-gray-500 border-8 bg-white rounded-2xl flex items-center justify-center overflow-hidden ${isDragging ? 'bg-gray-200' : 'bg-white'}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                {imageFile ? (
                                    <img src={imagePreview} alt="Uploaded" className="w-full h-full object-cover"/>
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
                            <textarea
                                className="w-full h-32 md:h-40 mt-8 border-gray-500 border-8 bg-white rounded-2xl flex items-center justify-center focus:outline-none text-lg md:text-xl text-center"
                                placeholder="輸入情緒"
                                rows="4"
                                value={text}
                                onChange={handleChange}
                            ></textarea>

                            {/* Save Button */}
                            <button
                                onClick={handleSave}
                                className="bg-orange-500 text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-orange-600 hover:scale-110 active:scale-95 transition duration-300 ease-in-out text-md md:text-lg lg:text-xl mb-3 mt-4"
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
