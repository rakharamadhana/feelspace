import React, {useEffect, useState} from 'react';
import SideNav from '../components/SideNav';
import Notification from "../components/Notification";

const TeacherDashboard = () => {
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

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
        <div className="flex">
            <SideNav role={role} />
            <Notification message={notificationMessage} type={notificationType} onClose={handleCloseNotification} />
            <div className="flex-grow p-10" style={{backgroundColor: '#fff4e3'}}>
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-6">Teacher Dashboard</h1>
                    <p>Welcome, {role} {name}!</p>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
