const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api';

/**
 * Fetch publicly visible active campaigns.
 *
 * Category filtering is performed by Laravel.
 *
 * Example:
 * fetchPublicCampaigns()
 *
 * fetchPublicCampaigns({
 *     category: 'food-assistance',
 * })
 */
export const fetchPublicCampaigns = async (params = {}) => {
    const searchParams = new URLSearchParams();

    if (
        params.category &&
        params.category !== 'all'
    ) {
        searchParams.set(
            'category',
            params.category
        );
    }

    if (
        params.search &&
        params.search.trim()
    ) {
        searchParams.set(
            'search',
            params.search.trim()
        );
    }

    const queryString = searchParams.toString();

    const url =
        `${API_BASE_URL}/public/campaigns` +
        `${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch campaigns (HTTP ${response.status})`
        );
    }

    const result = await response.json();

    return Array.isArray(result?.data)
        ? result.data
        : [];
};

/**
 * Fetch the latest active campaign for the homepage.
 *
 * This uses the lightweight featured endpoint instead of
 * downloading the complete public campaign collection.
 */
export const fetchFeaturedCampaign = async () => {
    const url =
        `${API_BASE_URL}/public/campaigns/featured`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch featured campaign (HTTP ${response.status})`
        );
    }

    const result = await response.json();

    return result?.data || null;
};

/**
 * Fetch a single active campaign by ID.
 */
export const fetchPublicCampaignById = async (id) => {
    if (!id) {
        return null;
    }

    const url =
        `${API_BASE_URL}/public/campaigns/${id}`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        if (response.status === 404) {
            return null;
        }

        throw new Error(
            `Failed to fetch campaign details (HTTP ${response.status})`
        );
    }

    const result = await response.json();

    return result?.data || null;
};

/**
 * Fetch canonical categories.
 *
 * Slugs come directly from the categories table.
 */
export const fetchPublicCategories = async () => {
    const url =
        `${API_BASE_URL}/public/categories`;

    const response = await fetch(url, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch categories (HTTP ${response.status})`
        );
    }

    const result = await response.json();

    return Array.isArray(result?.data)
        ? result.data
        : [];
};