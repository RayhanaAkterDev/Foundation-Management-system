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

export const updateAssignment = (id, fields) =>
    apiRequest(`/organization/assignments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(fields),
    });

export const requestWithdrawal = (id, withdrawalReason) =>
    apiRequest(`/organization/assignments/${id}/withdraw`, {
        method: 'PATCH',
        body: JSON.stringify({
            withdrawal_reason: withdrawalReason,
        }),
    });