export const HELP_REQUESTS_PER_PAGE = 25;

export const STATUS_LABELS = {
    pending: 'Pending',
    verified: 'Verified',
    rejected: 'Rejected',
};

export const URGENCY_LABELS = {
    normal: 'Normal',
    high: 'High',
    critical: 'Critical',
};

export const ASSIGNMENT_STATUS_LABELS = {
    assigned: 'Assigned',
    accepted: 'Accepted',
    withdrawn: 'Withdrawn',
    rejected: 'Rejected',
};

export const URGENCY_STYLES = {
    critical: {
        dot: 'bg-red-500',
        text: 'text-red-600',
    },
    high: {
        dot: 'bg-amber-500',
        text: 'text-amber-600',
    },
    normal: {
        dot: 'bg-slate-400',
        text: 'text-text-secondary',
    },
};

export const STATUS_STYLES = {
    pending: {
        dot: 'bg-amber-500',
        text: 'text-amber-700',
        background: 'bg-amber-50',
    },

    verified: {
        dot: 'bg-primary',
        text: 'text-primary',
        background: 'bg-primary/[0.07]',
    },

    rejected: {
        dot: 'bg-red-500',
        text: 'text-red-700',
        background: 'bg-red-50',
    },
};

export const ACCEPTED_ASSIGNMENT_STATUSES = new Set([
    'assigned',
    'accepted',
]);