import React from 'react';

import { Outlet } from 'react-router-dom';

import Navbar from './navbar/Navbar';

import Footer from './footer/Footer';

import Chatbot from '@/components/chatbot/Chatbot';

import ChatbotProvider from '@/components/chatbot/ChatbotProvider';

const PublicLayout = () => {
    return (
        <ChatbotProvider>
            <Navbar />
            <Outlet />
            <Footer />
            <Chatbot />
        </ChatbotProvider>
    );
};

export default PublicLayout;
