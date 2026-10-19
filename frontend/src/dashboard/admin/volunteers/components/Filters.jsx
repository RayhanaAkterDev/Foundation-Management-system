import React from 'react';
import {
    Check,
    CircleCheck,
    CircleMinus,
    ShieldAlert,
    RotateCcw,
} from 'lucide-react';

const OPTIONS = [
    { value: 'all', label: 'All volunteers', icon: CircleCheck },
    { value: 'active', label: 'Active', icon: CircleCheck },
    { value: 'inactive', label: 'Inactive', icon: CircleMinus },
    { value: 'suspended', label: 'Suspended', icon: ShieldAlert },
];

const Filters = ({ statusFilter = 'all', onStatusChange }) => {
    const changeStatus = (value) => onStatusChange?.({ target: { value } });

    return (
        <div className="flex h-full min-w-0 flex-col bg-[#0E1219]">
            <div className="flex min-h-18 items-center justify-between gap-3 bg-[#1A222D] px-4 py-4 sm:px-5">
                <h3 className="text-[15px] font-semibold! text-[#EEF1F5]!">
                    Filter
                </h3>
                {statusFilter !== 'all' && (
                    <button
                        type="button"
                        onClick={() => changeStatus('all')}
                        className="group inline-flex items-center gap-1.5 text-[11px] font-medium! text-[#8792A1] transition-colors hover:text-[#EEF1F5] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#697586]"
                    >
                        <RotateCcw
                            size={12}
                            strokeWidth={1.8}
                            className="transition-transform group-hover:-rotate-45"
                        />
                        Clear all
                    </button>
                )}
            </div>
            <section className="border-t border-[#252D38] px-4 py-4">
                <h4 className="mb-3 px-1 text-[10px] font-semibold! uppercase tracking-normal text-[#697586]!">
                    Volunteer status
                </h4>
                <div className="space-y-0.5">
                    {OPTIONS.map(({ value, label, icon: Icon }) => {
                        const active = statusFilter === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => changeStatus(value)}
                                className={`group flex min-h-9.5 w-full items-center gap-2.5 px-3 py-2 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[#697586] ${active ? 'bg-[#1A222D]' : 'bg-transparent hover:bg-[#151B24]'}`}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.75}
                                    className={`shrink-0 ${active ? 'text-[#C2CBD6]' : 'text-[#697586] group-hover:text-[#AEB7C3]'}`}
                                />
                                <span
                                    className={`min-w-0 flex-1 truncate text-[11px] leading-5 ${active ? 'font-semibold! text-[#EEF1F5]' : 'font-medium! text-[#8792A1] group-hover:text-[#B8C0CA]'}`}
                                >
                                    {label}
                                </span>
                                <span
                                    aria-hidden="true"
                                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${active ? 'border-[#8493A6] bg-[#8493A6]' : 'border-[#455160] group-hover:border-[#697586]'}`}
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
};

export default Filters;
