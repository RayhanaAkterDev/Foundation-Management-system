import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <>
            <h4>404 - Page Not Found</h4>
            <Link to="/">Go Back Home</Link>
        </>
    );
};

export default NotFound;
