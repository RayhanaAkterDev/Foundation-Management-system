import React, { useMemo, useState } from 'react';

import { ChatbotContext } from './ChatbotContext';

const ChatbotProvider = ({ children }) => {
    const [pageContext, setPageContext] = useState(null);

    const value = useMemo(
        () => ({
            pageContext,
            setPageContext,
        }),
        [pageContext],
    );

    return (
        <ChatbotContext.Provider value={value}>
            {children}
        </ChatbotContext.Provider>
    );
};

export default ChatbotProvider;
