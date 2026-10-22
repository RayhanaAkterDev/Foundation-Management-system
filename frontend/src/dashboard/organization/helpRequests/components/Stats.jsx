import React from 'react';
import {
    Activity,
    CircleCheck,
    ClipboardList,
    Clock3,
    UserRoundCheck,
    XCircle,
} from 'lucide-react';

const STATUS = [
    {
        key: 'pending',
        label: 'Pending',
        icon: Clock3,
        color: '#C5A16D',
        background: '#29251F',
    },
    {
        key: 'verified',
        label: 'Verified',
        icon: UserRoundCheck,
        color: '#91A9CC',
        background: '#202B3D',
    },
    {
        key: 'in_progress',
        label: 'In Progress',
        icon: Activity,
        color: '#B4ADD9',
        background: '#222136',
    },
    {
        key: 'completed',
        label: 'Completed',
        icon: CircleCheck,
        color: '#98B9A4',
        background: '#202F29',
    },
    {
        key: 'rejected',
        label: 'Rejected',
        icon: XCircle,
        color: '#BD9299',
        background: '#30252A',
    },
];

export default function Stats({
    total = 0,
    pending = 0,
    verified = 0,
    in_progress = 0,
    completed = 0,
    rejected = 0,
}) {
    const totalValue = Number(total) || 0;

    const values = {
        pending,
        verified,
        in_progress,
        completed,
        rejected,
    };

    return (
        <section>
            <h2 className="mb-5 text-[18px] font-semibold tracking-[-0.02em] text-[#EEF1F5]! sm:mb-6">
                Help Requests overview
            </h2>

            <div
                aria-label="Help request statistics"
                className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]"
            >
                <div className="grid min-w-0 lg:grid-cols-[minmax(220px,26%)_minmax(0,1fr)]">
                    <div className="flex min-w-0 flex-col justify-between border-b border-[#29323E] bg-[#19212C] px-5 py-6 sm:px-7 lg:border-r lg:border-b-0">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center border border-[#384453] bg-[#202B38] text-[#B4C0CE]">
                                    <ClipboardList size={16} />
                                </span>

                                <h3 className="text-[15px] font-semibold text-[#E5EAF0]!">
                                    Help Requests
                                </h3>
                            </div>

                            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8492A5]">
                                Total requests
                            </p>

                            <div className="mt-2 flex items-end gap-2.5">
                                <span className="text-[58px] font-semibold leading-none tracking-[-0.065em] tabular-nums text-[#EEF1F5]! sm:text-[66px]">
                                    {totalValue}
                                </span>

                                <span className="mb-1.5 text-[12px] text-[#91A0B3]">
                                    requests
                                </span>
                            </div>
                        </div>

                        <p className="mt-6 border-t border-[#35404D] pt-3.5 text-[11px] text-[#91A0B3]">
                            Assigned to your organization
                        </p>
                    </div>

                    <div className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-[13px] font-semibold text-[#DDE4ED]!">
                                Request status
                            </h3>

                            <span className="text-[11px] text-[#718096]">
                                Distribution
                            </span>
                        </div>

                        <div className="divide-y divide-[#252E3A]">
                            {STATUS.map(
                                ({
                                    key,
                                    label,
                                    icon: Icon,
                                    color,
                                    background,
                                }) => {
                                    const count = Number(values[key]) || 0;

                                    const percentage =
                                        totalValue > 0
                                            ? Math.min(
                                                  100,
                                                  Math.max(
                                                      0,
                                                      (count / totalValue) *
                                                          100,
                                                  ),
                                              )
                                            : 0;

                                    return (
                                        <div
                                            key={key}
                                            className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(75px,38%)_38px] items-center gap-3 py-3.5 sm:grid-cols-[minmax(0,1fr)_minmax(110px,42%)_45px] sm:gap-5"
                                        >
                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <span
                                                    className="flex h-8 w-8 shrink-0 items-center justify-center"
                                                    style={{
                                                        backgroundColor:
                                                            background,
                                                        color,
                                                    }}
                                                >
                                                    <Icon
                                                        size={15}
                                                        strokeWidth={1.8}
                                                    />
                                                </span>

                                                <span className="truncate text-[12px] font-medium text-[#CDD6E1]">
                                                    {label}
                                                </span>
                                            </div>

                                            <div className="flex min-w-0 items-center gap-2.5">
                                                <div className="h-1.5 min-w-0 flex-1 overflow-hidden bg-[#293440]">
                                                    <div
                                                        className="h-full transition-[width] duration-300"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor:
                                                                color,
                                                        }}
                                                    />
                                                </div>

                                                <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-[#8492A5]">
                                                    {Math.round(percentage)}%
                                                </span>
                                            </div>

                                            <span className="text-right text-[19px] font-semibold tabular-nums text-[#E2E8F0]">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
