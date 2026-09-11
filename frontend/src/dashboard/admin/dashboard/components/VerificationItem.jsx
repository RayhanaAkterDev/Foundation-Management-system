import React from 'react';

import { Building2, ChevronRight } from 'lucide-react';

import { getVerificationName } from '../utils/dashboardHelpers';

const VerificationItem = ({ organization, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="
            group flex w-full items-center gap-4
            border-t border-primary/10
            px-1 py-4 text-left
            first:border-t-0
            transition-colors hover:bg-surface
        "
    >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-surface text-primary ring-1 ring-primary/10">
            <Building2 size={15} strokeWidth={1.8} />
        </span>

        <span className="min-w-0 flex-1">
            <span className="block truncate font-jost text-sm font-semibold text-text-primary">
                {getVerificationName(organization)}
            </span>

            <span className="mt-1 block font-jost text-xs text-text-secondary">
                Organization verification
            </span>
        </span>

        <span className="shrink-0 border border-primary/15 bg-surface px-2 py-1 font-poppins text-[8px] font-semibold uppercase tracking-[0.08em] text-primary">
            Pending
        </span>

        <ChevronRight
            size={15}
            className="shrink-0 text-primary/30 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
        />
    </button>
);

export default VerificationItem;
