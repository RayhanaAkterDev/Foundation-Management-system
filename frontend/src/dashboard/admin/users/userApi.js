import { apiRequest } from '../../../api/client';

// --------------------------------
// Users - List
// --------------------------------

export const fetchUsers = async () => {
    return apiRequest('/admin/users');
};

// --------------------------------
// Users - View
// --------------------------------

export const fetchUser = async (userId) => {
    return apiRequest(`/admin/users/${userId}`);
};

// --------------------------------
// Users - Create
// --------------------------------

export const createUser = async (userData) => {
    return apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

// --------------------------------
// Users - Update
// --------------------------------

export const updateUser = async (userId, userData) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

// --------------------------------
// Users - Delete
// --------------------------------

export const deleteUser = async (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
    });
};
