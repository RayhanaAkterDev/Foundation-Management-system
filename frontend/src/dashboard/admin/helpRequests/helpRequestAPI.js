const API_BASE_URL = 'http://127.0.0.1:8000/api';

const getToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

const request = async (url, options = {}) => {
    const token = getToken();

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {}),
        },
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(
            data.message || 'Something went wrong.',
        );

        error.status = response.status;
        error.errors = data.errors || {};

        throw error;
    }

    return data;
};

// --------------------------------
// Help Requests - List
// --------------------------------

export const fetchHelpRequests = async () => {
    return request('/admin/help-requests');
};

// --------------------------------
// Help Requests - View
// --------------------------------

export const fetchHelpRequest = async (helpRequestId) => {
    return request(`/admin/help-requests/${helpRequestId}`);
};

// --------------------------------
// Help Requests - Verify / Reject
// --------------------------------

export const updateHelpRequestVerification = async (
    helpRequestId,
    status,
    verificationNote = null,
) => {
    return request(
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
    return request(
        `/admin/help-requests/${helpRequestId}/assignment`,
        {
            method: 'POST',
            body: JSON.stringify(assignmentData),
        },
    );
};