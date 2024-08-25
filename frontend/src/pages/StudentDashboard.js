import React, {useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FadeIn from "../components/FadeIn";
import Notification from "../components/Notification";

const StudentDashboard = () => {
    const role = localStorage.getItem('role');
    const [isTouched, setIsTouched] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState('');
    const [notificationType, setNotificationType] = useState('');

    useEffect(() => {
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

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <FadeIn>
                <Navbar role={role} />
                <Notification message={notificationMessage} type={notificationType} onClose={handleCloseNotification} />
                <div className="flex-grow flex flex-col items-center justify-center text-black">
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl font-bold mb-16">首頁</h1>
                    <div className="flex space-x-6">
                        <Card
                            imageUrl={`${process.env.PUBLIC_URL}/assets/menu-1.png`}
                            text="案例探討"
                            bgColor="bg-red-300"
                            textColor="text-white"
                            link="/case-study"
                            className={`${
                                isTouched ? 'scale-95' : 'hover:scale-110'
                            } transition transform duration-300 ease-in-out`}
                            onTouchStart={() => setIsTouched(true)}
                            onTouchEnd={() => setIsTouched(false)}
                        />
                        <Card
                            imageUrl={`${process.env.PUBLIC_URL}/assets/menu-2.png`}
                            text="桌遊專區"
                            bgColor="bg-blue-300"
                            textColor="text-white"
                            link="https://playingcards.io/aqwqfg"
                            target="_blank"  // This will make the link open in a new tab
                            className={`${
                                isTouched ? 'scale-95' : 'hover:scale-110'
                            } transition transform duration-300 ease-in-out`}
                            onTouchStart={() => setIsTouched(true)}
                            onTouchEnd={() => setIsTouched(false)}
                        />

                        <Card
                            imageUrl={`${process.env.PUBLIC_URL}/assets/menu-3.png`}
                            text="卡牌創作"
                            bgColor="bg-green-300"
                            textColor="text-white"
                            link="/card-maker"
                            className={`${
                                isTouched ? 'scale-95' : 'hover:scale-110'
                            } transition transform duration-300 ease-in-out`}
                            onTouchStart={() => setIsTouched(true)}
                            onTouchEnd={() => setIsTouched(false)}
                        />
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default StudentDashboard;
