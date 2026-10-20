import { Clock3, CheckCircle2, PlayCircle, XCircle } from 'lucide-react';
export const statusConfig = {
    assigned: {
        label: 'Pending Response',
        icon: Clock3,
        className: 'border-[#72552B] bg-[#2B2318] text-[#D8B47B]',
    },

    accepted: {
        label: 'Accepted',
        icon: CheckCircle2,
        className: 'border-[#334C70] bg-[#182638] text-[#9CBCE8]',
    },

    in_progress: {
        label: 'In Progress',
        icon: PlayCircle,
        className: 'border-[#285D56] bg-[#142B29] text-[#87C5BA]',
    },

    completed: {
        label: 'Completed',
        icon: CheckCircle2,
        className: 'border-[#315A49] bg-[#172A23] text-[#9AD1AE]',
    },

    rejected: {
        label: 'Rejected',
        icon: XCircle,
        className: 'border-[#6D373B] bg-[#321D22] text-[#E7A1A5]',
    },

    withdrawn: {
        label: 'Withdrawn',
        icon: XCircle,
        className: 'border-[#343E4B] bg-[#1A222D] text-[#AAB3BF]',
    },

    withdrawal_requested: {
        label: 'Withdrawal Pending',
        icon: Clock3,
        className: 'border-[#72552B] bg-[#2B2318] text-[#D8B47B]',
    },
};

export const volunteerStatusCopy = {
    active: {
        title: 'Your volunteer account is active.',
        description:
            'You can receive campaign assignments and participate in humanitarian activities.',
    },

    inactive: {
        title: 'Your volunteer account is inactive.',
        description:
            'You are currently not eligible for new campaign assignments.',
    },

    suspended: {
        title: 'Your volunteer account is suspended.',
        description:
            'Your volunteer account is currently unavailable for campaign assignments.',
    },
};

// =============================================================
// HELPERS
// =============================================================

export const formatDate = (date) => {
    if (!date) return '—';

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return '—';
    }

    return parsed.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const getCampaignLocation = (campaign) => {
    if (!campaign) return 'Location not specified';

    return (
        campaign.location ||
        campaign.address ||
        campaign.district ||
        'Location not specified'
    );
};

export const getRequestDirection = (request) => {
    if (!request?.id) {
        return null;
    }

    const userId = Number(request?.user_id);
    const requestedBy = Number(request?.requested_by);

    if (
        Number.isFinite(userId) &&
        Number.isFinite(requestedBy) &&
        userId === requestedBy
    ) {
        return 'application';
    }

    return 'invitation';
};

