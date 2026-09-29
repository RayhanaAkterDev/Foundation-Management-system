import { apiRequest } from './client';

export const fetchTestimonials = async () => {
    return apiRequest('/testimonials', {
        method: 'GET',
    });
};

export const submitTestimonial = async ({
    message,
    consent_to_publish,
}) => {
    return apiRequest('/testimonials', {
        method: 'POST',
        body: JSON.stringify({
            message,
            consent_to_publish,
        }),
    });
};