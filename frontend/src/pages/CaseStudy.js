import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FadeIn from "../components/FadeIn";
import Notification from '../components/Notification'; // Adjust the import path as needed
import api from '../api';

const CaseStudy = () => {
    const [cases, setCases] = useState([]);
    const role = localStorage.getItem('role');
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        api.get('/cases', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setCases(response.data);
            })
            .catch(error => {
                console.error('Error fetching cases:', error);
            });

        // Get the notification object from localStorage
        const notificationData = localStorage.getItem('notification');

        if (notificationData) {
            const { message, type } = JSON.parse(notificationData); // Parse the JSON string
            setNotificationMessage(message);
            setNotificationType(type || 'success'); // Default to 'success' if no type is provided
            localStorage.removeItem('notification'); // Clear notification after displaying it
        }
    }, []);

    const handleCloseNotification = () => {
        setNotificationMessage(''); // Clear the notification message
        setNotificationType(''); // Clear the notification type
    };

    // Calculate the min-width based on the number of cards
    const cardWidth = 320; // Adjust this to the width of your cards
    const spacing = 24; // Adjust this to the spacing between your cards (in px)
    const minWidth = cases.length * (cardWidth + spacing) + 'px';

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <div className="flex-grow flex flex-col items-center justify-center text-black">
                <FadeIn>
                    <Notification message={notificationMessage} type={notificationType} onClose={handleCloseNotification} />
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl text-center font-bold mb-16">案例探討</h1>
                    <div className="w-full max-w-6xl overflow-x-auto">
                        <div
                            className="flex space-x-6 pb-4 px-4"
                            style={{ minWidth: minWidth }}
                        >
                            {cases.map(caseItem => (
                                <Card
                                    key={caseItem.id}
                                    imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`}
                                    text={caseItem.title}
                                    borderColor={caseItem.borderColor}
                                    textColor={caseItem.textColor}
                                    link={`/case-study/detail/${caseItem.id}`}
                                    simple={true}
                                />
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default CaseStudy;
