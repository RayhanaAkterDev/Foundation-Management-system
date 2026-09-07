import { apiRequest } from '@/api/client';

// =========================================================
// Get current user's help requests
// =========================================================

export const getMyHelpRequests = async () => {
    return apiRequest('/help-requests', {
        method: 'GET',
    });
};

// Keep this alias if any newer component already imports it.
export const fetchMyHelpRequests = getMyHelpRequests;

// =========================================================
// Get single help request
// =========================================================

export const getHelpRequest = async (id) => {
    return apiRequest(`/help-requests/${id}`, {
        method: 'GET',
    });
};

// =========================================================
// Create help request
// =========================================================

export const createHelpRequest = async (data) => {
    return apiRequest('/help-requests', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// =========================================================
// Update help request
// =========================================================

export const updateHelpRequest = async (id, data) => {
    return apiRequest(`/help-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};

// =========================================================
// Delete help request
// =========================================================

export const deleteHelpRequest = async (id) => {
    return apiRequest(`/help-requests/${id}`, {
        method: 'DELETE',
    });
};