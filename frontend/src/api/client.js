const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000/api';

const getToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

export const apiRequest = async (url, options = {}) => {
    const token = getToken();
    const isFormData = options.body instanceof FormData;

    const headers = {
        Accept: 'application/json',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let body = options.body;

    if (isFormData) {
        delete headers['Content-Type'];
    } else if (body !== undefined && body !== null) {
        headers['Content-Type'] = 'application/json';

        if (typeof body !== 'string') {
            body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
        body,
    });

    const contentType =
        response.headers.get('content-type') || '';

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

// =========================================================
// Authenticated binary response (private file preview)
// =========================================================

export const apiRequestBlob = async (url, options = {}) => {
    const token = getToken();

    const headers = {
        Accept: '*/*',
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const contentType =
            response.headers.get('content-type') || '';

        let message = 'Unable to retrieve the file.';

        try {
            if (contentType.includes('application/json')) {
                const data = await response.json();
                message = data?.message || message;
            } else {
                const responseText = await response.text();

                if (responseText.trim()) {
                    message = responseText;
                }
            }
        } catch {
            // Keep the default error message.
        }

        const error = new Error(message);

        error.status = response.status;

        throw error;
    }

    return response.blob();
};