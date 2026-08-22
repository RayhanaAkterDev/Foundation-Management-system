import { apiRequest } from '@/api/client';

/**
 * =========================================================
 * MY HELP REQUESTS API
 * =========================================================
 *
 * These functions are used by:
 * src/dashboard/individual/MyHelpRequests.jsx
 *
 * Current help request workflow:
 *
 * pending
 *    ↓
 * verified ───────→ rejected
 *    ↓
 * assigned
 *    ↓
 * in_progress
 *    ↓
 * completed
 *
 * The authenticated user's help requests are retrieved
 * through GET /help-requests.
 */

/**
 * =========================================================
 * FETCH MY HELP REQUESTS
 * =========================================================
 *
 * GET /api/help-requests
 *
 * The backend should return the authenticated user's
 * help requests.
 */
export const fetchMyHelpRequests = async () => {
    return apiRequest('/help-requests', {
        method: 'GET',
    });
};

/**
 * =========================================================
 * GET SINGLE HELP REQUEST
 * =========================================================
 *
 * GET /api/help-requests/{id}
 *
 * Used when a specific help request needs to be retrieved.
 */
export const getHelpRequest = async (id) => {
    if (!id) {
        throw new Error('Help request ID is required.');
    }

    return apiRequest(`/help-requests/${id}`, {
        method: 'GET',
    });
};

/**
 * =========================================================
 * CREATE HELP REQUEST
 * =========================================================
 *
 * POST /api/help-requests
 *
 * Used when an authenticated individual or organization
 * submits a new help request.
 *
 * New requests should normally start with:
 * pending
 */
export const createHelpRequest = async (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Help request data is required.');
    }

    return apiRequest('/help-requests', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * =========================================================
 * UPDATE HELP REQUEST
 * =========================================================
 *
 * PATCH /api/help-requests/{id}
 *
 * This is kept available for fields that the backend allows
 * the request owner to update.
 *
 * Status transitions should NOT be controlled from the
 * frontend. They must be enforced by the Laravel backend.
 */
export const updateHelpRequest = async (id, data) => {
    if (!id) {
        throw new Error('Help request ID is required.');
    }

    if (!data || typeof data !== 'object') {
        throw new Error('Update data is required.');
    }

    return apiRequest(`/help-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    });
};

/**
 * =========================================================
 * DELETE HELP REQUEST
 * =========================================================
 *
 * DELETE /api/help-requests/{id}
 *
 * MyHelpRequests.jsx only shows the Delete action for
 * requests whose current status is "pending".
 *
 * The backend must also enforce this rule.
 */
export const deleteHelpRequest = async (id) => {
    if (!id) {
        throw new Error('Help request ID is required.');
    }

    return apiRequest(`/help-requests/${id}`, {
        method: 'DELETE',
    });
};