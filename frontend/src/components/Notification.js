import React, { useEffect, useState } from 'react';

const Notification = ({ message, type, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setVisible(true); // Show notification with fade-in effect

            const timer = setTimeout(() => {
                setVisible(false); // Trigger fade-out effect
                setTimeout(onClose, 500); // Wait for fade-out to complete before calling onClose
            }, 3000); // Automatically hide the notification after 3 seconds

            return () => clearTimeout(timer); // Clear the timer if the component unmounts
        }
    }, [message, onClose]);

    if (!message) return null;

    // Define background color classes based on the type of notification
    const getBackgroundColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-orange-500';
            default:
                return 'bg-blue-500'; // Default color if no type is provided
        }
    };

    return (
        <div
            className={`fixed top-16 right-4 ${getBackgroundColor(
                type
            )} text-white px-4 py-2 rounded shadow-md transition-opacity duration-500 ease-in-out flex items-center ${
                visible ? 'opacity-100' : 'opacity-0'
            }`}
        >
            <span className="flex-1">{message}</span>
            <button className="ml-4 text-white hover:text-gray-200" onClick={onClose}>
                ✕
            </button>
        </div>
    );
};

export default Notification;
