import { apiRequest } from './client';

export const getCurrentUser = async () => {
    return apiRequest('/user');
};