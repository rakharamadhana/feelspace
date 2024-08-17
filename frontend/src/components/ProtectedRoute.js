import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api'; // Import your API utility

const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            api.post('/verify-token', { token })
                .then(response => {
                    // If the token is valid, authenticate the user
                    setIsAuthenticated(true);
                })
                .catch(error => {
                    // If the token is invalid or any other error occurs, set authentication to false
                    console.error('Token verification failed:', error);
                    setIsAuthenticated(false);
                });
        } else {
            // No token found, redirect to login
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) {
        // Optionally render a loading spinner while the authentication status is being determined
        return (
            <div className="flex items-center justify-center min-h-screen"
                    style={{backgroundColor: '#fff4e3'}}>

            </div>
        );
    }

    return isAuthenticated ? element : <Navigate to="/login"/>;
};

export default ProtectedRoute;
