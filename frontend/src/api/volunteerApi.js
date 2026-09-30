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

/**
 * Public directory of active volunteers.
 *
 * This endpoint does not require authentication.
 * The backend intentionally returns only public-safe
 * volunteer information.
 */
export const fetchPublicVolunteers = async () => {
    return apiRequest('/public/volunteers', {
        method: 'GET',
    });
};