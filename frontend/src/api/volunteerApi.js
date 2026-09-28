import { apiRequest } from './client';

export const submitVolunteerApplication = async () => {
    return apiRequest('/volunteer', {
        method: 'POST',
    });
};

export const fetchVolunteerStatus = async () => {
    return apiRequest('/volunteer', {
        method: 'GET',
    });
};