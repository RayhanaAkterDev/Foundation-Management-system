import { apiRequest } from '@/api/client';

// --------------------------------
// Campaigns - Admin List
// --------------------------------

export const fetchCampaigns = async () => {
    return apiRequest('/admin/campaigns');
};

// --------------------------------
// Campaigns - View
// --------------------------------

export const fetchCampaign = async (campaignId) => {
    return apiRequest(`/admin/campaigns/${campaignId}`);
};

// --------------------------------
// Campaigns - Verify / Reject
// --------------------------------

export const updateCampaignVerification = async (
    campaignId,
    status,
    verificationNote = null,
) => {
    return apiRequest(
        `/admin/campaigns/${campaignId}/verification`,
        {
            method: 'PATCH',
            body: JSON.stringify({
                status,
                verification_note: verificationNote,
            }),
        },
    );
};

// --------------------------------
// Campaigns - Volunteer Assignment
// --------------------------------

export const assignCampaignVolunteers = async (
    campaignId,
    volunteerIds,
) => {
    return apiRequest(
        `/admin/campaigns/${campaignId}/volunteers`,
        {
            method: 'PATCH',
            body: JSON.stringify({
                volunteer_ids: volunteerIds,
            }),
        },
    );
};

// --------------------------------
// Campaigns - Complete
// --------------------------------

export const completeCampaign = async (campaignId) => {
    return apiRequest(
        `/admin/campaigns/${campaignId}/completion`,
        {
            method: 'PATCH',
        },
    );
};

// --------------------------------
// Volunteers - Admin List
// --------------------------------

export const fetchVolunteers = async () => {
    return apiRequest('/admin/volunteers');
};

// --------------------------------
// Organizations - Admin List
// --------------------------------

export const fetchOrganizations = async () => {
    return apiRequest('/admin/organizations');
};