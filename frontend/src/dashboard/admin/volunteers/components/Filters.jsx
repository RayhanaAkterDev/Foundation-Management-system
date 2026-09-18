import React from 'react';

import { Check, ChevronDown, RotateCcw } from 'lucide-react';

const Filter = ({ status = 'all', onStatusChange, onReset }) => {
    const statuses = [
        {
            value: 'all',
            label: 'All volunteers',
        },
        {
            value: 'active',
            label: 'Active',
        },
        {
            value: 'pending',
            label: 'Pending',
        },
        {
            value: 'inactive',
            label: 'Inactive',
        },
    ];

    return (
        <aside className="bg-primary p-5 text-white sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/60">
                        Directory controls
                    </p>

                    <h3 className="mt-2 font-jost text-lg font-semibold tracking-tight text-white">
                        Filter volunteers
                    </h3>

                    <p className="mt-1.5 text-[11px] leading-5 text-white/65">
                        Narrow the volunteer directory by current status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onReset}
                    className="flex h-8 w-8 shrink-0 items-center justify-center text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Reset filters"
                    title="Reset filters"
                >
                    <RotateCcw size={15} strokeWidth={1.8} />
                </button>
            </div>

            <div className="mt-7">
                <label
                    htmlFor="volunteer-status-filter"
                    className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60"
                >
                    Status
                </label>

                <div className="relative mt-2">
                    <select
                        id="volunteer-status-filter"
                        value={status}
                        onChange={(event) =>
                            onStatusChange?.(event.target.value)
                        }
                        className="h-11 w-full appearance-none border border-white/15 bg-white/10 px-3.5 pr-10 text-xs font-medium text-white outline-none transition-colors focus:border-white/40 focus:bg-white/[0.14]"
                    >
                        {statuses.map((item) => (
                            <option
                                key={item.value}
                                value={item.value}
                                className="bg-white text-text-primary"
                            >
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        size={15}
                        strokeWidth={1.8}
                        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/60"
                    />
                </div>
            </div>

            <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/50">
                    Current filter
                </p>

                <div className="mt-2 flex items-center gap-2 text-xs font-medium text-white">
                    <Check
                        size={14}
                        strokeWidth={2}
                        className="text-white/70"
                    />

                    {statuses.find((item) => item.value === status)?.label ||
                        'All volunteers'}
                </div>
            </div>
        </aside>
    );
};

export default Filter;
