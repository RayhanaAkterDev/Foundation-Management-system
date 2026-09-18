import { apiRequest } from '@/api/client';

export const fetchVolunteers = async () => {
    return apiRequest('/admin/volunteers-test');
};

export const fetchVolunteerCandidates = async () => {
    return apiRequest('/admin/volunteers/candidates');
};

export const sendVolunteerRequests = async (userIds) => {
    return apiRequest('/admin/volunteers/requests', {
        method: 'POST',
        body: JSON.stringify({
            user_ids: userIds,
        }),
    });
};