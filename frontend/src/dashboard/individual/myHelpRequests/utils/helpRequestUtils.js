import {
    ACCEPTED_ASSIGNMENT_STATUSES,
    STATUS_LABELS,
    URGENCY_LABELS,
} from '../constants/helpRequestConstants';

export const normalizeHelpRequest = (request) => {
    if (!request) {
        return request;
    }

    const verificationNote = request.verification_note || '';

    return {
        ...request,
        title: request.title || '',
        description: request.description || '',
        category: request.category || '',
        urgency: request.urgency || 'normal',
        district: request.district || '',
        address: request.address || '',
        status: request.status || '',
        verification_note: verificationNote,
        verificationNote,
        notes: verificationNote,
        assignments: Array.isArray(request.assignments)
            ? request.assignments
            : [],
    };
};

export const normalizeHelpRequests = (requests) =>
    Array.isArray(requests) ? requests.map(normalizeHelpRequest) : [];

export const getStatusLabel = (status) => STATUS_LABELS[status] || status || '—';

export const getUrgencyLabel = (urgency) =>
    URGENCY_LABELS[urgency] || urgency || 'Normal';

export const getAssignmentInfo = (request) => {
    const assignments = Array.isArray(request?.assignments)
        ? request.assignments
        : [];

    if (!assignments.length) {
        return {
            state: 'not_assigned',
            label: 'Not assigned',
            currentAssignment: null,
            previousAssignment: null,
        };
    }

    const sortedAssignments = [...assignments].sort(
        (a, b) =>
            (b?.assigned_at ? new Date(b.assigned_at).getTime() : 0) -
            (a?.assigned_at ? new Date(a.assigned_at).getTime() : 0),
    );

    const currentAssignment = sortedAssignments[0];

    if (currentAssignment?.status === 'pending') {
        return {
            state: 'pending',
            label: 'Assignment pending',
            currentAssignment,
            previousAssignment: sortedAssignments[1] || null,
        };
    }

    if (ACCEPTED_ASSIGNMENT_STATUSES.has(currentAssignment?.status)) {
        return {
            state: 'accepted',
            label:
                currentAssignment?.organization?.name ||
                'Organization assigned',
            currentAssignment,
            previousAssignment:
                sortedAssignments
                    .slice(1)
                    .find(
                        (assignment) =>
                            assignment?.organization &&
                            assignment?.id !== currentAssignment?.id,
                    ) || null,
        };
    }

    return {
        state: 'not_assigned',
        label: 'Not assigned',
        currentAssignment: null,
        previousAssignment: null,
    };
};
