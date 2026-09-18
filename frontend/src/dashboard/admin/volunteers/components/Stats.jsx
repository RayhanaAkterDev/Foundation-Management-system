import React from 'react';

import { CircleCheck, Clock3, UserRound, UserRoundCheck } from 'lucide-react';

const Stats = ({ total = 0, active = 0, pending = 0, inactive = 0 }) => {
    const secondaryStats = [
        {
            label: 'Active',
            value: active,
            icon: UserRoundCheck,
            accent: 'bg-emerald-500',
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            label: 'Pending',
            value: pending,
            icon: Clock3,
            accent: 'bg-amber-500',
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-600',
        },
        {
            label: 'Inactive',
            value: inactive,
            icon: CircleCheck,
            accent: 'bg-slate-400',
            iconBg: 'bg-slate-100',
            iconColor: 'text-slate-500',
        },
    ];

    return (
        <section className="overflow-hidden border border-border bg-white">
            <div className="grid lg:grid-cols-[1.35fr_2fr]">
                {/* TOTAL VOLUNTEERS */}
                <div className="relative overflow-hidden bg-primary px-6 py-7 sm:px-8 sm:py-8">
                    <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />
                    <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full border border-white/5" />

                    <div className="relative flex min-h-36 flex-col justify-between">
                        <div className="flex items-start justify-between gap-5">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                                    Volunteer network
                                </p>

                                <h3 className="mt-2 text-[17px] font-semibold tracking-[-0.02em] text-white">
                                    Total volunteers
                                </h3>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-white/10">
                                <UserRound
                                    size={19}
                                    strokeWidth={1.7}
                                    className="text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-7 flex items-end justify-between gap-5">
                            <div>
                                <p className="font-jost text-[42px] font-semibold leading-none tracking-[-0.04em] text-white">
                                    {total}
                                </p>

                                <p className="mt-2 text-[11px] leading-4 text-white/50">
                                    Registered across the platform
                                </p>
                            </div>

                            <span className="hidden border-l border-white/15 pl-4 text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-white/45 sm:block">
                                Community
                                <br />
                                support
                            </span>
                        </div>
                    </div>
                </div>

                {/* STATUS STATS */}
                <div className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {secondaryStats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.label}
                                className="relative bg-white px-5 py-6 transition-colors hover:bg-surface-soft sm:px-6 sm:py-7"
                            >
                                {/* Status accent */}
                                <div
                                    className={`absolute left-0 top-0 h-0.5 w-full ${stat.accent}`}
                                />

                                <div className="flex min-h-36 flex-col justify-between">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                                                {stat.label}
                                            </p>

                                            <p className="mt-1.5 text-[10px] text-slate-400">
                                                Volunteer status
                                            </p>
                                        </div>

                                        <div
                                            className={`flex h-9 w-9 shrink-0 items-center justify-center ${stat.iconBg}`}
                                        >
                                            <Icon
                                                size={17}
                                                strokeWidth={1.8}
                                                className={stat.iconColor}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-7">
                                        <p className="font-jost text-[34px] font-semibold leading-none tracking-[-0.035em] text-text-primary">
                                            {stat.value}
                                        </p>

                                        <div className="mt-3 flex items-center gap-2">
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${stat.accent}`}
                                            />

                                            <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-400">
                                                {stat.label} volunteers
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Stats;
