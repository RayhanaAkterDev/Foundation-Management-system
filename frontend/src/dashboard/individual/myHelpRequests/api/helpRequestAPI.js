
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
        body:
            data instanceof FormData
                ? data
                : JSON.stringify(data),
    });
};

// =========================================================
// Analyze help request with AI assistance
// =========================================================
//
// This only analyzes the natural-language description.
// It does NOT create a Help Request.
//

export const analyzeHelpRequest = async (description) => {
    return apiRequest('/help-requests/analyze', {
        method: 'POST',
        body: JSON.stringify({
            description,
        }),
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

// =========================================================
// Submit additional evidence requested by admin
// =========================================================

export const submitAdditionalEvidence = async (
    id,
    evidenceRequestId,
    formData,
) => {
    return apiRequest(
        `/help-requests/${id}/evidence-requests/${evidenceRequestId}/submit`,
        {
            method: 'POST',
            body: formData,
        },
    );
};

// =========================================================
// Get secure evidence viewing URL
// =========================================================

export const getHelpRequestEvidenceUrl = async (
    id,
    evidenceId,
) => {
    return apiRequest(
        `/help-requests/${id}/evidences/${evidenceId}/view`,
        {
            method: 'GET',
        },
    );
};
