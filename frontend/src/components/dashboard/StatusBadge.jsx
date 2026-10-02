import React from 'react';

/* ==========================================================================
   STATUS CONFIGURATION
============================================================================ */

const STATUS_MAP = {
    active: {
        label: 'Active',
        bg: 'bg-[#22362D]',
        border: 'border-[#315140]',
        text: 'text-[#91C9A7]!',
        dot: 'bg-[#75B88F]',
    },

    approved: {
        label: 'Approved',
        bg: 'bg-[#22362D]',
        border: 'border-[#315140]',
        text: 'text-[#91C9A7]!',
        dot: 'bg-[#75B88F]',
    },

    completed: {
        label: 'Completed',
        bg: 'bg-[#22362D]',
        border: 'border-[#315140]',
        text: 'text-[#91C9A7]!',
        dot: 'bg-[#75B88F]',
    },

    verified: {
        label: 'Verified',
        bg: 'bg-[#22362D]',
        border: 'border-[#315140]',
        text: 'text-[#91C9A7]!',
        dot: 'bg-[#75B88F]',
    },

    in_progress: {
        label: 'In Progress',
        bg: 'bg-[#252F3B]',
        border: 'border-[#35465A]',
        text: 'text-[#9DB8D4]!',
        dot: 'bg-[#7EA2C7]',
    },

    pending: {
        label: 'Pending',
        bg: 'bg-[#382F23]',
        border: 'border-[#56452C]',
        text: 'text-[#D8B278]!',
        dot: 'bg-[#D39A4A]',
    },

    under_review: {
        label: 'Under Review',
        bg: 'bg-[#382F23]',
        border: 'border-[#56452C]',
        text: 'text-[#D8B278]!',
        dot: 'bg-[#D39A4A]',
    },

    upcoming: {
        label: 'Upcoming',
        bg: 'bg-[#382F23]',
        border: 'border-[#56452C]',
        text: 'text-[#D8B278]!',
        dot: 'bg-[#D39A4A]',
    },

    inactive: {
        label: 'Inactive',
        bg: 'bg-[#2C3038]',
        border: 'border-[#404650]',
        text: 'text-[#969DA9]!',
        dot: 'bg-[#737B88]',
    },

    unverified: {
        label: 'Unverified',
        bg: 'bg-[#2C3038]',
        border: 'border-[#404650]',
        text: 'text-[#969DA9]!',
        dot: 'bg-[#737B88]',
    },

    suspended: {
        label: 'Suspended',
        bg: 'bg-[#38272C]',
        border: 'border-[#54353C]',
        text: 'text-[#D99A9F]!',
        dot: 'bg-[#C8737B]',
    },

    cancelled: {
        label: 'Cancelled',
        bg: 'bg-[#38272C]',
        border: 'border-[#54353C]',
        text: 'text-[#D99A9F]!',
        dot: 'bg-[#C8737B]',
    },
};

/* ==========================================================================
   STATUS BADGE
============================================================================ */

const StatusBadge = ({ status, showDot = true }) => {
    const key = String(status || '')
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');

    const config = STATUS_MAP[key] || {
        label: status || '—',
        bg: 'bg-[#2C3038]',
        border: 'border-[#404650]',
        text: 'text-[#969DA9]!',
        dot: 'bg-[#737B88]',
    };

    return (
        <span
            className={`
                inline-flex
                min-h-6
                items-center
                gap-1.5

                rounded-md

                border

                px-2

                text-[10px]
                font-semibold
                leading-none

                whitespace-nowrap

                ${config.bg}
                ${config.border}
                ${config.text}
            `}
        >
            {showDot && (
                <span
                    aria-hidden="true"
                    className={`
                        h-1.5
                        w-1.5
                        shrink-0

                        rounded-full

                        ${config.dot}
                    `}
                />
            )}

            {config.label}
        </span>
    );
};

export default StatusBadge;
