
import { apiRequest, apiRequestBlob } from '@/api/client';

// --------------------------------
// Help Requests - List
// --------------------------------

export const fetchHelpRequests = async () => {
    return apiRequest('/admin/help-requests');
};

// --------------------------------
// Help Requests - View
// --------------------------------

export const fetchHelpRequest = async (helpRequestId) => {
    return apiRequest(`/admin/help-requests/${helpRequestId}`);
};

// --------------------------------
// Help Requests - Update
// --------------------------------

export const updateHelpRequest = async (helpRequestId, requestData) => {
    if (!helpRequestId) {
        throw new Error('Help request ID is required.');
    }

    return apiRequest(`/admin/help-requests/${helpRequestId}`, {
        method: 'PUT',
        body: JSON.stringify({
            title: requestData.title,
            description: requestData.description,
            category: requestData.category,
            urgency: requestData.urgency,
            district: requestData.district,
            address: requestData.address ?? null,
        }),
    });
};

// --------------------------------
// Help Requests - Verify / Reject
// --------------------------------

export const updateHelpRequestVerification = async (
    helpRequestId,
    status,
    verificationNote = null,
) => {
    return apiRequest(
        `/admin/help-requests/${helpRequestId}/verification`,
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
// Help Requests - Urgency
// --------------------------------

export const updateHelpRequestUrgency = async (helpRequestId, urgency) => {
    return apiRequest(`/admin/help-requests/${helpRequestId}/urgency`, {
        method: 'PATCH',
        body: JSON.stringify({
            urgency,
        }),
    });
};

// --------------------------------
// Help Requests - Assignment
// --------------------------------

export const assignHelpRequest = async (
    helpRequestId,
    assignmentData,
) => {
    return apiRequest(
        `/admin/help-requests/${helpRequestId}/assignment`,
        {
            method: 'PATCH',
            body: JSON.stringify(assignmentData),
        },
    );
};

// --------------------------------
// Help Requests - Request Additional Evidence
// --------------------------------

export const requestAdditionalEvidence = async (
    helpRequestId,
    message,
) => {
    return apiRequest(
        `/admin/help-requests/${helpRequestId}/evidence-requests`,
        {
            method: 'POST',
            body: JSON.stringify({
                message,
            }),
        },
    );
};

// --------------------------------
// Help Requests - Secure Evidence Viewing
// --------------------------------

export const getHelpRequestEvidenceUrl = async (
    helpRequestId,
    evidenceId,
) => {
    return apiRequest(
        `/help-requests/${helpRequestId}/evidences/${evidenceId}/view`,
        {
            method: 'GET',
        },
    );
};

// --------------------------------
// Help Requests - Private Evidence Preview
// --------------------------------

export const getHelpRequestEvidencePreview = async (
    helpRequestId,
    evidenceId,
) => {
    return apiRequestBlob(
        `/help-requests/${helpRequestId}/evidences/${evidenceId}/preview`,
        {
            method: 'GET',
        },
    );
};

// --------------------------------
// Organizations - Admin List
// --------------------------------

export const fetchOrganizations = async () => {
    return apiRequest('/admin/organizations');
};

// --------------------------------
// Volunteers - Admin List
// --------------------------------

export const fetchVolunteers = async () => {
    return apiRequest('/admin/volunteers');
};

// --------------------------------
// Help Requests - Duplicate Check
// --------------------------------

export const checkHelpRequestDuplicates = async (helpRequestId) => {
    return apiRequest(
        `/admin/help-requests/${helpRequestId}/duplicate-check`,
        {
            method: 'POST',
        },
    );
};
