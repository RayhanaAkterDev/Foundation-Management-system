const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api';

const getAuthHeaders = () => {
    const token =
    sessionStorage.getItem('auth_token');

    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token
            ? {
                  Authorization: `Bearer ${token}`,
              }
            : {}),
    };
};

// --------------------------------
// Fetch campaigns
// --------------------------------

export const fetchCampaigns =
    async () => {
        const response = await fetch(
            `${API_BASE_URL}/admin/campaigns`,
            {
                method: 'GET',
                headers:
                    getAuthHeaders(),
            },
        );

        const data =
            await response.json();

        if (!response.ok) {
            throw new Error(
                data?.message ||
                    'Failed to fetch campaigns.',
            );
        }

        return data;
    };

// --------------------------------
// Verify campaign
// --------------------------------

export const verifyCampaign =
    async (
        campaignId,
        payload,
    ) => {
        const response = await fetch(
            `${API_BASE_URL}/admin/campaigns/${campaignId}/verification`,
            {
                method: 'PATCH',
                headers:
                    getAuthHeaders(),
                body: JSON.stringify(
                    payload,
                ),
            },
        );

        const data =
            await response.json();

        if (!response.ok) {
            const validationMessage =
                data?.errors
                    ? Object.values(
                          data.errors,
                      )
                          .flat()
                          .join(' ')
                    : null;

            throw new Error(
                validationMessage ||
                    data?.message ||
                    'Campaign verification failed.',
            );
        }

        return data;
    };