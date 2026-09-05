import { apiRequest } from '@/api/client';

export const fetchNotifications = () =>
    apiRequest('/notifications');

export const markNotificationAsRead = (id) =>
    apiRequest(`/notifications/${id}/read`, {
        method: 'PATCH',
    });

export const markAllNotificationsAsRead = () =>
    apiRequest('/notifications/read-all', {
        method: 'PATCH',
    });