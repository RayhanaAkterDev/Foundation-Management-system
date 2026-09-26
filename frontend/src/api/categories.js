const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api';

export const fetchCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
            Accept: 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(
            `Failed to fetch categories (HTTP ${response.status})`,
        );
    }

    const result = await response.json();

    return result.data || [];
};