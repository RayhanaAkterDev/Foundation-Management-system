const API_BASE_URL = 'http://127.0.0.1:8000/api/admin/users';

const getToken = () => {
    return (
        localStorage.getItem('auth_token') ||
        sessionStorage.getItem('auth_token')
    );
};

const getHeaders = () => {
    const token = getToken();

    if (!token) {
        throw new Error('Authentication token not found.');
    }

    return {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

const parseResponse = async (response, defaultMessage) => {
    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || defaultMessage);

        error.status = response.status;
        error.errors = data.errors || {};

        throw error;
    }

    return data;
};

export const fetchUsers = async () => {
    const response = await fetch(API_BASE_URL, {
        headers: getHeaders(),
    });

    return parseResponse(response, 'Unable to load users.');
};

export const fetchUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        headers: getHeaders(),
    });

    return parseResponse(response, 'Unable to load user details.');
};

export const createUser = async (userData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            ...getHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return parseResponse(response, 'Unable to create user.');
};

export const updateUser = async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
            ...getHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    return parseResponse(response, 'Unable to update user.');
};

export const deleteUser = async (userId) => {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });

    return parseResponse(response, 'Unable to delete user.');
};
