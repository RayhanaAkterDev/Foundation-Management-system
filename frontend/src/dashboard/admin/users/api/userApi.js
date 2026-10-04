// src/dashboard/admin/users/api/userApi.js

import { apiRequest } from '@/api/client';

/* ============================================================
   USERS — LIST
============================================================ */

export const fetchUsers = async () => {
    return apiRequest('/admin/users');
};

/* ============================================================
   USERS — VIEW
============================================================ */

export const fetchUser = async (userId) => {
    return apiRequest(`/admin/users/${userId}`);
};

/* ============================================================
   USERS — CREATE
============================================================ */

export const createUser = async (userData) => {
    return apiRequest('/admin/users', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

/* ============================================================
   USERS — UPDATE
============================================================ */

export const updateUser = async (
    userId,
    userData,
) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
    });
};

/* ============================================================
   USERS — UPDATE + REFRESH
============================================================ */

export const updateUserAndRefresh = async (
    userId,
    userData,
) => {
    await updateUser(userId, userData);

    return fetchUser(userId);
};

/* ============================================================
   USERS — DELETE
============================================================ */

export const deleteUser = async (userId) => {
    return apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
    });
};