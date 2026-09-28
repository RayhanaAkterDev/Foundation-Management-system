import { apiRequest } from '@/api/client';

export const sendChatbotMessage = async (
    message,
    pageContext = null
) => {
    return apiRequest('/chatbot', {
        method: 'POST',
        body: JSON.stringify({
            message,
            page_context: pageContext,
        }),
    });
};