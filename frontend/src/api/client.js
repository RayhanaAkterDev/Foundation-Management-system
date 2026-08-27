const API_BASE_URL = 'https://stand-for-people-api.onrender.com/api';

const getToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

export const apiRequest = async (url, options = {}) => {
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
