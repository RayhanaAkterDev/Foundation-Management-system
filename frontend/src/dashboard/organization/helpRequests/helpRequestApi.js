import { apiRequest } from '@/api/client';

export const fetchAssignments = () =>
    apiRequest('/organization/assignments');

export const acceptAssignment = (id) =>
    apiRequest(`/organization/assignments/${id}/accept`, {
        method: 'PATCH',
    });

export const rejectAssignment = (id, rejectionNote) =>
    apiRequest(`/organization/assignments/${id}/reject`, {
        method: 'PATCH',
        body: JSON.stringify({
            rejection_note: rejectionNote,
        }),
    });