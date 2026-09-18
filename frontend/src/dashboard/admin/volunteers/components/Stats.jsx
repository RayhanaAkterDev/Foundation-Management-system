import React from 'react';

import { CircleCheck, Clock3, UserRound, UserRoundCheck } from 'lucide-react';

const Stats = ({ total = 0, active = 0, pending = 0, inactive = 0 }) => {
    const secondaryStats = [
        {
            label: 'Active',
            value: active,
            icon: UserRoundCheck,
        },
        {
            label: 'Pending',
            value: pending,
            icon: Clock3,
        },
        {
            label: 'Inactive',
            value: inactive,
            icon: CircleCheck,
        },
    ];

    return (
        <section className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {/* Total */}
            <div className="relative bg-primary px-6 py-6 sm:px-7">
                <div className="flex h-full min-h-28 flex-col justify-between">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/65">
                            Total volunteers
                        </span>

                        <UserRound
                            size={18}
                            strokeWidth={1.7}
                            className="text-white/65"
                        />
                    </div>

                    <div className="mt-5">
                        <p className="font-jost text-4xl font-semibold leading-none tracking-tight text-white">
                            {total}
                        </p>

                        <p className="mt-2 text-[11px] leading-4 text-white/65">
                            Registered volunteer network
                        </p>
                    </div>
                </div>
            </div>

            {secondaryStats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="bg-white px-6 py-6 sm:px-7"
                    >
                        <div className="flex min-h-28 flex-col justify-between">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                    {stat.label}
                                </span>

                                <Icon
                                    size={18}
                                    strokeWidth={1.7}
                                    className="text-text-secondary"
                                />
                            </div>

                            <div className="mt-5">
                                <p className="font-jost text-3xl font-semibold leading-none tracking-tight text-text-primary">
                                    {stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default Stats;
