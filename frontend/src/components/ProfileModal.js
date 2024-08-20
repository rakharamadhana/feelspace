import React from 'react';
import Profile from '../pages/Profile';
import FadeIn from "./FadeIn"; // Import your existing Profile component

const ProfileModal = ({ onClose }) => {
    const handleBackgroundClick = (e) => {
        // If the user clicks directly on the background (not on the modal content), close the modal
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <FadeIn>
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
            onClick={handleBackgroundClick}
        >
            <div className="relative bg-white w-full max-w-lg mx-auto p-8 rounded-lg shadow-lg">
                <button
                    className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    &times; {/* Close button */}
                </button>
                <Profile /> {/* Render the Profile component inside the modal */}
            </div>
        </div>
        </FadeIn>
    );
};

export default ProfileModal;
