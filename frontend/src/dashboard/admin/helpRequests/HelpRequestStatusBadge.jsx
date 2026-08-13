import React from 'react';
import { Clock3, CircleCheck, CircleX, UserCheck } from 'lucide-react';

const statusConfig = {
    pending: {
        label: 'Pending',
        icon: Clock3,
        className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    verified: {
        label: 'Verified',
        icon: CircleCheck,
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    rejected: {
        label: 'Rejected',
        icon: CircleX,
        className: 'bg-red-50 text-red-700 border-red-200',
    },
    assigned: {
        label: 'Assigned',
        icon: UserCheck,
        className: 'bg-blue-50 text-blue-700 border-blue-200',
    },
};

const HelpRequestStatusBadge = ({ status }) => {
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}
        >
            <Icon size={13} />
            {config.label}
        </span>
    );
};

export default HelpRequestStatusBadge;
