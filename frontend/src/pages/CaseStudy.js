import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import FadeIn from "../components/FadeIn";
import api from '../api';  // Import the api instance

const CaseStudy = () => {
    const [cases, setCases] = useState([]);
    const role = localStorage.getItem('role');

    useEffect(() => {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        // Make the API request with the Authorization header
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
    }, []);

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fff4e3' }}>
            <Navbar role={role} />
            <div className="flex-grow flex flex-col items-center justify-center text-black">
                <FadeIn>
                    <h1 className="text-6xl lg:text-8xl xl:text-9xl text-center font-bold mb-16">案例探討</h1>
                    <div className="flex space-x-6 overflow-x-auto">
                        {cases.map(caseItem => (
                            <Card
                                key={caseItem.id}
                                imageUrl={`${process.env.PUBLIC_URL}/assets/image.png`}
                                text={caseItem.title}
                                borderColor={caseItem.borderColor}
                                textColor={caseItem.textColor}
                                link={`/case-study/detail/${caseItem.id}`}  // Generate dynamic link using case_id
                                simple={true}
                            />
                        ))}
                    </div>
                </FadeIn>
            </div>
        </div>
    );
};

export default CaseStudy;
