import React from 'react';

/* ==========================================================================
   STATUS CONFIGURATION
============================================================================ */

const STATUS_MAP = {
    /* ======================================================================
       POSITIVE / SUCCESS
    ====================================================================== */

    active: {
        label: 'Active',
        bg: 'bg-[#14231D]',
        border: 'border-[#294438]',
        text: 'text-[#8EC5A3]!',
        dot: 'bg-[#6FAE87]',
    },

    approved: {
        label: 'Approved',
        bg: 'bg-[#14231D]',
        border: 'border-[#294438]',
        text: 'text-[#8EC5A3]!',
        dot: 'bg-[#6FAE87]',
    },

    completed: {
        label: 'Completed',
        bg: 'bg-[#14231D]',
        border: 'border-[#294438]',
        text: 'text-[#8EC5A3]!',
        dot: 'bg-[#6FAE87]',
    },

    verified: {
        label: 'Verified',
        bg: 'bg-[#14231D]',
        border: 'border-[#294438]',
        text: 'text-[#8EC5A3]!',
        dot: 'bg-[#6FAE87]',
    },

    /* ======================================================================
       INFORMATION / PROGRESS
    ====================================================================== */

    in_progress: {
        label: 'In Progress',
        bg: 'bg-[#151E28]',
        border: 'border-[#2B3C4E]',
        text: 'text-[#91ABC5]!',
        dot: 'bg-[#7294B5]',
    },

    /* ======================================================================
       WARNING / WAITING
    ====================================================================== */

    pending: {
        label: 'Pending',
        bg: 'bg-[#241E15]',
        border: 'border-[#443723]',
        text: 'text-[#D0AA70]!',
        dot: 'bg-[#C28E45]',
    },

    under_review: {
        label: 'Under Review',
        bg: 'bg-[#241E15]',
        border: 'border-[#443723]',
        text: 'text-[#D0AA70]!',
        dot: 'bg-[#C28E45]',
    },

    upcoming: {
        label: 'Upcoming',
        bg: 'bg-[#241E15]',
        border: 'border-[#443723]',
        text: 'text-[#D0AA70]!',
        dot: 'bg-[#C28E45]',
    },

    /* ======================================================================
       NEUTRAL / INACTIVE
    ====================================================================== */

    inactive: {
        label: 'Inactive',
        bg: 'bg-[#151B24]',
        border: 'border-[#29323E]',
        text: 'text-[#8792A1]!',
        dot: 'bg-[#657181]',
    },

    unverified: {
        label: 'Unverified',
        bg: 'bg-[#151B24]',
        border: 'border-[#29323E]',
        text: 'text-[#8792A1]!',
        dot: 'bg-[#657181]',
    },

    /* ======================================================================
       NEGATIVE / RESTRICTED
    ====================================================================== */

    suspended: {
        label: 'Suspended',
        bg: 'bg-[#281A1F]',
        border: 'border-[#493038]',
        text: 'text-[#D99A9F]!',
        dot: 'bg-[#C8737B]',
    },

    cancelled: {
        label: 'Cancelled',
        bg: 'bg-[#281A1F]',
        border: 'border-[#493038]',
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
        bg: 'bg-[#151B24]',
        border: 'border-[#29323E]',
        text: 'text-[#8792A1]!',
        dot: 'bg-[#657181]',
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
                font-semibold!
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
