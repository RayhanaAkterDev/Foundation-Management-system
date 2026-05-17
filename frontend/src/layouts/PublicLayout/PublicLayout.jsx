import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './navbar/Navbar.jsx';
import Footer from './Footer';

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default PublicLayout;
