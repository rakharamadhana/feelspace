import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const FadeIn = ({ children }) => {
    const [fade, setFade] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setFade(true);
    }, [location]);

    return (
        <div className={`transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}>
            {children}
        </div>
    );
};

export default FadeIn;
