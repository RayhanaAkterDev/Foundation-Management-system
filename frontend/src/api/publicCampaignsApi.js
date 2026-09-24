const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api';

/**
 * Fetch all publicly visible active campaigns, optionally filtered by category or search.
 *
 * @param {Object} [params]
 * @param {string} [params.category]
 * @param {string} [params.search]
 * @returns {Promise<Array>}
 */
export const fetchPublicCampaigns = async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (params.category && params.category !== 'all') {
        searchParams.set('category', params.category);
    }

    if (params.search && params.search.trim()) {
        searchParams.set('search', params.search.trim());
    }

    const queryString = searchParams.toString();
    const url = `${API_BASE_URL}/public/campaigns${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch campaigns (HTTP ${response.status})`);
    }

    const result = await response.json();
    return result.data || [];
};

/**
 * Fetch a single active campaign by ID.
 *
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export const fetchPublicCampaignById = async (id) => {
    const url = `${API_BASE_URL}/public/campaigns/${id}`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }
        throw new Error(`Failed to fetch campaign details (HTTP ${response.status})`);
    }

    const result = await response.json();
    return result.data || null;
};

/**
 * Fetch categories with active campaign counts.
 *
 * @returns {Promise<Array>}
 */
export const fetchPublicCategories = async () => {
    const url = `${API_BASE_URL}/public/categories`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch categories (HTTP ${response.status})`);
    }

    const result = await response.json();
    return result.data || [];
};
