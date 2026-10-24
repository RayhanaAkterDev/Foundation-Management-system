import React from 'react';
import {
    Check,
    RotateCcw,
    Clock3,
    CircleCheck,
    CircleX,
    ListFilter,
} from 'lucide-react';

const OPTIONS = [
    { value: 'all', label: 'All assignments', icon: ListFilter },
    { value: 'assigned', label: 'Pending response', icon: Clock3 },
    { value: 'accepted', label: 'Accepted', icon: CircleCheck },
    { value: 'in_progress', label: 'In progress', icon: Clock3 },
    { value: 'completed', label: 'Completed', icon: CircleCheck },
    { value: 'rejected', label: 'Declined', icon: CircleX },
    // {
    //     value: 'withdrawal_requested',
    //     label: 'Withdrawal requested',
    //     icon: Clock3,
    // },
    { value: 'withdrawn', label: 'Withdrawn', icon: CircleX },
];

export default function ActivityHistoryFilters({
    value = 'all',
    onChange,
    counts = {},
}) {
    return (
        <div className="flex h-full min-w-0 flex-col bg-[#0E1219]">
            <div className="flex min-h-18 items-center justify-between gap-3 bg-[#1A222D] px-4 py-4 sm:px-5">
                <h3 className="text-[15px] font-semibold! text-[#EEF1F5]!">
                    Filter
                </h3>
                {value !== 'all' && (
                    <button
                        type="button"
                        onClick={() => onChange('all')}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium! text-[#8792A1] hover:text-[#EEF1F5]"
                    >
                        <RotateCcw size={13} /> Clear all
                    </button>
                )}
            </div>
            <section className="border-t border-[#252D38] px-4 py-4">
                <h4 className="mb-3 px-1 text-[10px] font-semibold! uppercase text-[#697586]!">
                    Assignment status
                </h4>
                <div className="space-y-0.5">
                    {OPTIONS.map(({ value: option, label, icon: Icon }) => {
                        const active = option === value;
                        return (
                            <button
                                key={option}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange(option)}
                                className={`group flex min-h-9.5 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors ${active ? 'bg-[#1A222D]' : 'hover:bg-[#151B24]'}`}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.75}
                                    className={
                                        active
                                            ? 'shrink-0 text-[#C2CBD6]'
                                            : 'shrink-0 text-[#697586]'
                                    }
                                />
                                <span
                                    className={`min-w-0 flex-1 truncate text-[11px] ${active ? 'font-semibold! text-[#EEF1F5]' : 'font-medium! text-[#8792A1]'}`}
                                >
                                    {label}
                                </span>
                                <span className="text-[10px] tabular-nums text-[#697586]">
                                    {counts[option] ?? 0}
                                </span>
                                <span
                                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#8493A6] bg-[#8493A6]' : 'border-[#455160]'}`}
                                >
                                    {active && (
                                        <Check
                                            size={9}
                                            strokeWidth={2.5}
                                            className="text-[#0E1219]"
                                        />
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
