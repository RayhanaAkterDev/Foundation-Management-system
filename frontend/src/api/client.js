const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

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

    let body = options.body;

    if (isFormData) {
        // Let the browser set the multipart boundary.
        delete headers['Content-Type'];
    } else if (body !== undefined && body !== null) {
        headers['Content-Type'] = 'application/json';

        // Convert JS objects into JSON before sending.
        if (typeof body !== 'string') {
            body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        body,
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
                    message:
                        'The server returned an invalid JSON response.',
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