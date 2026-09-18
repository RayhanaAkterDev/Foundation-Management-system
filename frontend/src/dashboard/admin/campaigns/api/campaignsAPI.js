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
    const response = await fetch(
        `${API_BASE_URL}/admin/campaigns`,
        {
            method: 'GET',
            headers: getHeaders(),
        },
    );

    return parseResponse(response);
};

/*
|--------------------------------------------------------------------------
| Fetch campaign volunteer candidates
|--------------------------------------------------------------------------
|
| Returns active, available, email-verified individual
| volunteers who are not currently assigned to another
| active campaign.
|
| GET /api/admin/campaign-volunteers/candidates
|
*/

export const fetchCampaignVolunteerCandidates = async () => {
    const response = await fetch(
        `${API_BASE_URL}/admin/campaign-volunteers/candidates`,
        {
            method: 'GET',
            headers: getHeaders(),
        },
    );

    return parseResponse(response);
};

/**
 * --------------------------------------------------------------------------
 * Assign volunteers to campaign
 * --------------------------------------------------------------------------
 *
 * Multiple volunteers can be assigned to the same campaign at once.
 *
 * PATCH /api/admin/campaigns/{id}/assignment
 *
 */

export const assignCampaignVolunteer = async (
    campaignId,
    payload,
) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    if (!payload || typeof payload !== 'object') {
        throw new Error(
            'Campaign assignment data is required.',
        );
    }

    const volunteerIds = Array.isArray(
        payload.volunteer_ids,
    )
        ? payload.volunteer_ids
              .map((id) => Number(id))
              .filter((id) => Number.isInteger(id) && id > 0)
        : [];

    if (volunteerIds.length === 0) {
        throw new Error(
            'Volunteer selection is required.',
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/campaigns/${campaignId}/assignment`,
        {
            method: 'PATCH',
            headers: getHeaders({
                json: true,
            }),
            body: JSON.stringify({
                volunteer_ids: volunteerIds,
                assignment_note:
                    payload.assignment_note ?? null,
            }),
        },
    );

    return parseResponse(response);
};
/*
|--------------------------------------------------------------------------
| Create Campaign
|--------------------------------------------------------------------------
|
| Admin creates a new campaign.
|
| New campaigns are created as:
|
| unverified
|
| Backend endpoint:
|
| POST /api/admin/campaigns
|
*/

export const createCampaign = async (payload) => {
    if (!payload || typeof payload !== 'object') {
        throw new Error(
            'Campaign creation data is required.',
        );
    }

    const response = await fetch(
        `${API_BASE_URL}/admin/campaigns`,
        {
            method: 'POST',
            headers: getHeaders({
                json: true,
            }),
            body: JSON.stringify(payload),
        },
    );

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
| Backend endpoint:
|
| PATCH /api/admin/campaigns/{id}/verification
|
*/

export const verifyCampaign = async (
    campaignId,
    payload,
) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    const status = payload?.status;

    if (
        status !== 'active' &&
        status !== 'rejected'
    ) {
        throw new Error(
            'Invalid campaign verification status. Use "active" or "rejected".',
        );
    }

    const body = {
        status,
        verification_note:
            payload?.verification_note ?? null,
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

export const updateCampaignStatus = async (
    campaignId,
    payload,
) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    const status = payload?.status;

    if (
        status !== 'completed' &&
        status !== 'cancelled'
    ) {
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

export const updateCampaign = async (
    campaignId,
    payload,
) => {
    if (!campaignId) {
        throw new Error('Campaign ID is required.');
    }

    if (!payload || typeof payload !== 'object') {
        throw new Error(
            'Campaign update data is required.',
        );
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