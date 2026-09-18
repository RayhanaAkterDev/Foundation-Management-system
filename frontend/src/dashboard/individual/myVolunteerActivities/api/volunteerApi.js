import { apiRequest } from '@/api/client';

// =========================================================
// Get current user's volunteer information
// =========================================================

export const getMyVolunteer = async () => {
    return apiRequest('/volunteer', {
        method: 'GET',
    });
};

// =========================================================
// Send volunteer request
// =========================================================

export const sendVolunteerRequest = async () => {
    return apiRequest('/volunteer', {
        method: 'POST',
    });
};

// =========================================================
// Accept administrator volunteer invitation
// =========================================================

export const acceptVolunteerRequest = async (id) => {
    return apiRequest(`/volunteer/requests/${id}/accept`, {
        method: 'PATCH',
    });
};

// =========================================================
// Reject administrator volunteer invitation
// =========================================================

export const rejectVolunteerRequest = async (id) => {
    return apiRequest(`/volunteer/requests/${id}/reject`, {
        method: 'PATCH',
    });
};

// =========================================================
// Accept campaign assignment
// =========================================================

export const acceptCampaignAssignment = async (id) => {
    return apiRequest(
        `/volunteer/campaign-assignments/${id}/accept`,
        {
            method: 'PATCH',
        },
    );
};

// =========================================================
// Reject campaign assignment
// =========================================================

export const rejectCampaignAssignment = async (id) => {
    return apiRequest(
        `/volunteer/campaign-assignments/${id}/reject`,
        {
            method: 'PATCH',
        },
    );
};

// =========================================================
// Start campaign assignment
// =========================================================

export const startCampaignAssignment = async (id) => {
    return apiRequest(
        `/volunteer/campaign-assignments/${id}/start`,
        {
            method: 'PATCH',
        },
    );
};

// =========================================================
// Complete campaign assignment
// =========================================================

export const completeCampaignAssignment = async (id) => {
    return apiRequest(
        `/volunteer/campaign-assignments/${id}/complete`,
        {
            method: 'PATCH',
        },
    );
};