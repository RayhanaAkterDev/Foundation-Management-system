import React from 'react';

import { ArrowUpRight, ClipboardList } from 'lucide-react';

import {
    getRequestLocation,
    getRequestTitle,
    getRequestUrgency,
} from '../utils/dashboardHelpers';

const RequestItem = ({ request, onClick }) => {
    const urgency = getRequestUrgency(request);

    const urgencyStyles = {
        critical: 'border-red-200 bg-red-50 text-red-700',
        urgent: 'border-orange-200 bg-orange-50 text-orange-700',
        high: 'border-accent/30 bg-accent/10 text-accent',
        normal: 'border-border bg-background-alt text-text-secondary',
        low: 'border-border bg-background-alt text-text-secondary',
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                group flex w-full items-center gap-4
                border-t border-accent/15
                px-1 py-4 text-left
                first:border-t-0
                transition-colors hover:bg-surface
            "
        >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-surface text-accent ring-1 ring-accent/15">
                <ClipboardList size={15} strokeWidth={1.8} />
            </span>

            <span className="min-w-0 flex-1">
                <span className="block truncate font-jost text-sm font-semibold text-text-primary">
                    {getRequestTitle(request)}
                </span>

                <span className="mt-1 block truncate font-jost text-xs text-text-secondary">
                    {getRequestLocation(request)}
                </span>
            </span>

            <span
                className={`
                    shrink-0 border px-2 py-1
                    font-poppins text-[8px] font-semibold
                    uppercase tracking-[0.08em]
                    ${urgencyStyles[urgency] || urgencyStyles.normal}
                `}
            >
                {urgency}
            </span>

            <ArrowUpRight
                size={15}
                className="
                    shrink-0 text-accent/40
                    transition-all
                    group-hover:-translate-y-0.5
                    group-hover:translate-x-0.5
                    group-hover:text-accent
                "
            />
        </button>
    );
};

export default RequestItem;
