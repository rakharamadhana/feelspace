import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fff4e3' }}>
            <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold mb-6">Register As</h1>
                <button
                    onClick={() => navigate('/register-teacher')}
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
                >
                    Teacher
                </button>
                <button
                    onClick={() => navigate('/register-student')}
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition duration-300 mb-4"
                >
                    Student
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition duration-300"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ChooseRole;
