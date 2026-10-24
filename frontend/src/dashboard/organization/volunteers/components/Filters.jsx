import React from 'react';

import {
    Check,
    CircleCheck,
    Megaphone,
    RotateCcw,
    ListFilter,
} from 'lucide-react';

const formatLabel = (value) =>
    String(value)
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (character) => character.toUpperCase());

const FilterOption = ({ label, active, onClick, icon: Icon = CircleCheck }) => (
    <button
        type="button"
        aria-pressed={active}
        onClick={onClick}
        className={`group flex min-h-9.5 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${
            active ? 'bg-[#1A222D]' : 'bg-transparent hover:bg-[#151B24]'
        }`}
    >
        <Icon
            size={14}
            strokeWidth={1.75}
            className={`shrink-0 ${
                active
                    ? 'text-[#C2CBD6]'
                    : 'text-[#697586] group-hover:text-[#AEB7C3]'
            }`}
        />

        <span
            className={`min-w-0 flex-1 truncate text-[11px] leading-5 ${
                active
                    ? 'font-semibold! text-[#EEF1F5]'
                    : 'font-medium! text-[#8792A1] group-hover:text-[#B8C0CA]'
            }`}
            title={label}
        >
            {label}
        </span>

        <span
            aria-hidden="true"
            className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                active ? 'border-[#8493A6] bg-[#8493A6]' : 'border-[#455160]'
            }`}
        >
            {active && (
                <Check size={9} strokeWidth={2.5} className="text-[#0E1219]" />
            )}
        </span>
    </button>
);

export default function Filters({
    statusFilter = 'all',
    onStatusChange,
    campaignFilter = 'all',
    onCampaignChange,
    statusOptions = [],
    campaignOptions = [],
    onClear,
}) {
    const hasFilters = statusFilter !== 'all' || campaignFilter !== 'all';

    return (
        <div className="flex h-full min-w-0 flex-col bg-[#0E1219]">
            <div className="flex min-h-18 items-center justify-between gap-3 bg-[#1A222D] px-4 py-4 sm:px-5">
                <h3 className="text-[15px] font-semibold! text-[#EEF1F5]!">
                    Filter
                </h3>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="group inline-flex items-center gap-1.5 text-[11px] font-medium! text-[#8792A1] hover:text-[#EEF1F5]"
                    >
                        <RotateCcw
                            size={12}
                            className="transition-transform group-hover:-rotate-45"
                        />
                        Clear all
                    </button>
                )}
            </div>

            <section className="border-t border-[#252D38] px-4 py-4">
                <h4 className="mb-3 px-1 text-[10px] font-semibold! uppercase text-[#697586]!">
                    Assignment status
                </h4>

                <div className="space-y-0.5">
                    <FilterOption
                        label="All assignments"
                        icon={ListFilter}
                        active={statusFilter === 'all'}
                        onClick={() => onStatusChange?.('all')}
                    />

                    {statusOptions.map((status) => (
                        <FilterOption
                            key={status}
                            label={formatLabel(status)}
                            active={statusFilter === status}
                            onClick={() => onStatusChange?.(status)}
                        />
                    ))}
                </div>
            </section>

            <section className="border-t border-[#252D38] px-4 py-4">
                <h4 className="mb-3 px-1 text-[10px] font-semibold! uppercase text-[#697586]!">
                    Campaign
                </h4>

                <div className="space-y-0.5">
                    <FilterOption
                        label="All campaigns"
                        icon={Megaphone}
                        active={campaignFilter === 'all'}
                        onClick={() => onCampaignChange?.('all')}
                    />

                    {campaignOptions.map((campaign) => (
                        <FilterOption
                            key={campaign}
                            label={campaign}
                            icon={Megaphone}
                            active={campaignFilter === campaign}
                            onClick={() => onCampaignChange?.(campaign)}
                        />
                    ))}
                </div>
            </section>

            <div className="mt-auto border-t border-[#252D38] px-5 py-5">
                <p className="text-[11px] leading-[1.7] text-[#697586]">
                    Narrow the directory by assignment status or campaign.
                </p>
            </div>
        </div>
    );
}
