const API_BASE_URL = 'http://127.0.0.1:8000/api';

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

const getAuthToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

/*
|--------------------------------------------------------------------------
| Request headers
|--------------------------------------------------------------------------
*/

const getHeaders = ({ json = false } = {}) => {
    const token = getAuthToken();

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    return {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(json
            ? {
                  'Content-Type': 'application/json',
              }
            : {}),
    };
};

/*
|--------------------------------------------------------------------------
| Parse API response
|--------------------------------------------------------------------------
*/

const parseResponse = async (response) => {
    let data = null;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error ||
            'Campaign request failed.';

        const error = new Error(message);

        error.status = response.status;
        error.errors = data?.errors || null;

        throw error;
    }

    return data;
};

/*
|--------------------------------------------------------------------------
| Fetch campaigns
|--------------------------------------------------------------------------
|
| GET /api/admin/campaigns
|
*/

export const fetchCampaigns = async () => {
    const response = await fetch(`${API_BASE_URL}/admin/campaigns`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return parseResponse(response);
};

/*
|--------------------------------------------------------------------------
| Verify / Reject Campaign
|--------------------------------------------------------------------------
|
| Workflow:
|
| unverified → active
| unverified → rejected
|
| The frontend sends ONLY:
|
| active
| rejected
|
| It does NOT send:
|
| pending_review
| verified
| unverified
| published
|
| Backend endpoint:
|
| PATCH /api/admin/campaigns/{id}/verification
|
*/

export const verifyCampaign = async (campaignId, payload) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    const status = payload?.status;

    if (status !== 'active' && status !== 'rejected') {
        throw new Error(
            'Invalid campaign verification status. Use "active" or "rejected".',
        );
    }

    const body = {
        status,
        verification_note: payload?.verification_note ?? null,
    };

    const response = await fetch(
        `${API_BASE_URL}/admin/campaigns/${campaignId}/verification`,
        {
            method: 'PATCH',
            headers: getHeaders({
                json: true,
            }),
            body: JSON.stringify(body),
        },
    );

    return parseResponse(response);
};

/*
|--------------------------------------------------------------------------
| Update Campaign Operational Status
|--------------------------------------------------------------------------
|
| Workflow:
|
| active → completed
| active → cancelled
|
| Backend endpoint:
|
| PATCH /api/admin/campaigns/{id}/status
|
*/

export const updateCampaignStatus = async (campaignId, payload) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    const status = payload?.status;

    if (status !== 'completed' && status !== 'cancelled') {
        throw new Error(
            'Invalid campaign status. Use "completed" or "cancelled".',
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/campaigns/${campaignId}/status`,
        {
            method: 'PATCH',
            headers: getHeaders({
                json: true,
            }),
            body: JSON.stringify({
                status,
            }),
        },
    );

    return parseResponse(response);
};

/*
|--------------------------------------------------------------------------
| Update Campaign Information
|--------------------------------------------------------------------------
|
| This is NOT a status transition.
|
| Allowed by the frontend only for:
|
| unverified
| active
|
| Backend endpoint:
|
| PUT /api/admin/campaigns/{id}
|
*/

export const updateCampaign = async (campaignId, payload) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    if (!payload || typeof payload !== 'object') {
        throw new Error('Campaign update data is required.');
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/campaigns/${campaignId}`,
        {
            method: 'PUT',
            headers: getHeaders({
                json: true,
            }),
            body: JSON.stringify(payload),
        },
    );

    return parseResponse(response);
};