import { useContext } from 'react';

import { ChatbotContext } from './ChatbotContext';

export const useChatbotContext = () => {
    const context = useContext(ChatbotContext);

    if (!context) {
        throw new Error(
            'useChatbotContext must be used within ChatbotProvider.',
        );
    }

    return context;
};