const API_BASE_URL =
    'https://stand-for-people-api.onrender.com/api';

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

    const isFormData = options.body instanceof FormData;

    const headers = {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const responseText = await response.text();

    let data = {};

    if (responseText.trim()) {
        if (contentType.includes('application/json')) {
            try {
                data = JSON.parse(responseText);
            } catch {
                data = {
                    message: 'The server returned an invalid JSON response.',
                };
            }
        } else {
            data = {
                message: responseText,
            };
        }
    }

    if (!response.ok) {
        const error = new Error(
            data?.message || 'Something went wrong.',
        );

        error.status = response.status;
        error.errors = data?.errors || {};

        throw error;
    }

    return data;
};