export const HELP_REQUESTS_PER_PAGE = 25;

export const STATUS_LABELS = {
    pending: 'Pending',
    verified: 'Verified',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    completed: 'Completed',
    rejected: 'Rejected',
};

export const URGENCY_LABELS = {
    critical: 'Critical',
    urgent: 'Urgent',
    high: 'High',
    normal: 'Normal',
    low: 'Low',
};

export const URGENCY_STYLES = {
    critical: { dot: 'bg-red-500', text: 'text-red-600' },
    urgent: { dot: 'bg-orange-500', text: 'text-orange-600' },
    high: { dot: 'bg-amber-500', text: 'text-amber-600' },
    low: { dot: 'bg-slate-400', text: 'text-text-secondary' },
    normal: { dot: 'bg-slate-400', text: 'text-text-secondary' },
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
    assigned: {
        dot: 'bg-primary',
        text: 'text-primary',
        background: 'bg-primary/[0.07]',
    },
    in_progress: {
        dot: 'bg-primary',
        text: 'text-primary',
        background: 'bg-primary/[0.10]',
    },
    completed: {
        dot: 'bg-emerald-500',
        text: 'text-emerald-700',
        background: 'bg-emerald-50',
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
    'active',
    'in_progress',
    'completed',
]);
