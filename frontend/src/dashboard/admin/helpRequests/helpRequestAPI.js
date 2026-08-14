import { apiRequest } from '../../../api/client';

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
