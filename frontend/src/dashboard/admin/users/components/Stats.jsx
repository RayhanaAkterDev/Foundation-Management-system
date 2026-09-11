import React, { useMemo } from 'react';
import {
    ArrowUpRight,
    Building2,
    ShieldCheck,
    UserRound,
    Users,
} from 'lucide-react';

const Stats = ({
    total = 0,
    individuals = 0,
    organizations = 0,
    administrators = 0,
}) => {
    const metrics = useMemo(
        () => [
            {
                label: 'Individuals',
                value: individuals,
                icon: UserRound,
            },
            {
                label: 'Organizations',
                value: organizations,
                icon: Building2,
            },
            {
                label: 'Administrators',
                value: administrators,
                icon: ShieldCheck,
            },
        ],
        [individuals, organizations, administrators],
    );

    const percentages = useMemo(() => {
        if (!total) {
            return {
                individuals: 0,
                organizations: 0,
                administrators: 0,
            };
        }

        return {
            individuals: (individuals / total) * 100,
            organizations: (organizations / total) * 100,
            administrators: (administrators / total) * 100,
        };
    }, [total, individuals, organizations, administrators]);

    return (
        <section className="pt-10 sm:pt-12 lg:pt-14">
            {/* =====================================================
                SECTION INTRO
            ====================================================== */}
            <div className="mb-5 px-1 sm:mb-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
                    <div className="min-w-0">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 shrink-0 bg-primary" />

                            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[10px]">
                                Community
                            </span>
                        </div>

                        <h2 className="max-w-2xl font-jost text-[22px] font-semibold leading-[1.15] tracking-tight text-text-primary sm:text-[25px] lg:text-[27px]">
                            The people behind{' '}
                            <span className="text-primary">
                                Stand For People
                            </span>
                        </h2>

                        <p className="mt-1.5 max-w-xl text-[12px] leading-5 text-text-secondary sm:text-[13px]">
                            Individuals, organizations, and administrators
                            working together across the platform.
                        </p>
                    </div>

                    <div className="flex shrink-0 items-baseline gap-2 pl-3 sm:pb-0.5 sm:pl-0">
                        <span className="text-lg font-semibold leading-none tracking-tight text-text-primary sm:text-xl">
                            {total}
                        </span>

                        <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-text-secondary sm:text-[10px]">
                            registered
                        </span>
                    </div>
                </div>
            </div>

            {/* =====================================================
                MAIN COMMUNITY PANEL
            ====================================================== */}
            <div className="overflow-hidden border border-border bg-surface">
                <div className="grid lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.7fr)]">
                    {/* =================================================
                        TOTAL
                    ================================================== */}
                    <div className="relative overflow-hidden bg-primary px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
                        {/* Decorative details */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-hidden"
                        >
                            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full border border-white/8" />
                            <div className="absolute -right-2 -top-2 h-20 w-20 rounded-full border border-white/[0.07]" />

                            <div className="absolute bottom-7 right-0 h-px w-24 bg-white/10" />
                            <div className="absolute bottom-3 right-0 h-px w-14 bg-white/[0.07]" />
                            <div className="absolute bottom-6 left-0 h-14 w-px bg-white/6" />
                        </div>

                        <div className="relative z-10">
                            {/* Label */}
                            <div className="flex items-center justify-between">
                                <div className="flex min-w-0 items-center gap-2.5">
                                    <Users
                                        size={17}
                                        strokeWidth={1.7}
                                        className="shrink-0 text-white/60"
                                    />

                                    <span className="truncate text-[9px] font-semibold uppercase tracking-[0.16em] text-white/60 sm:text-[10px]">
                                        Total community
                                    </span>
                                </div>

                                <span className="ml-4 shrink-0 text-[8px] font-medium uppercase tracking-[0.15em] text-white/30">
                                    01
                                </span>
                            </div>

                            {/* Number */}
                            <div className="mt-8 sm:mt-10 lg:mt-12">
                                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                                    <span className="font-jost text-[48px] font-semibold leading-none tracking-[-0.055em] text-white sm:text-[56px] lg:text-[60px]">
                                        {total}
                                    </span>

                                    <span className="text-[10px] text-white/40 sm:text-xs">
                                        accounts
                                    </span>
                                </div>

                                <div className="mt-4 flex max-w-sm items-start gap-2.5">
                                    <span className="mt-2 h-px w-7 shrink-0 bg-white/25" />

                                    <p className="text-[11px] leading-[1.6] text-white/60 sm:text-xs">
                                        Everyone with a registered place in the
                                        Stand For People community.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* =================================================
                        COMPOSITION
                    ================================================== */}
                    <div className="min-w-0 px-5 py-6 sm:px-7 sm:py-7 lg:px-8">
                        {/* Heading */}
                        <div className="flex items-start justify-between gap-5 border-b border-border pb-4 sm:pb-5">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-[13px] font-semibold text-text-primary sm:text-sm">
                                        Community composition
                                    </p>

                                    <ArrowUpRight
                                        size={14}
                                        strokeWidth={1.6}
                                        className="shrink-0 text-text-secondary"
                                    />
                                </div>

                                <p className="mt-1 text-[11px] leading-5 text-text-secondary sm:text-xs">
                                    Distribution across account types
                                </p>
                            </div>

                            <div className="hidden h-8 w-8 shrink-0 items-center justify-center bg-background-alt sm:flex">
                                <Users
                                    size={15}
                                    strokeWidth={1.6}
                                    className="text-primary"
                                />
                            </div>
                        </div>

                        {/* Distribution */}
                        <div className="mt-5 sm:mt-6">
                            <div className="flex items-center justify-between gap-4">
                                <span className="text-[9px] font-medium uppercase tracking-widest text-text-secondary sm:text-[10px]">
                                    Account distribution
                                </span>

                                <span className="text-[9px] font-medium uppercase tracking-widest text-text-secondary sm:text-[10px]">
                                    100%
                                </span>
                            </div>

                            <div className="mt-2.5 flex h-1.5 overflow-hidden bg-background-alt sm:h-2">
                                <div
                                    className="bg-primary transition-[width] duration-500"
                                    style={{
                                        width: `${percentages.individuals}%`,
                                    }}
                                />

                                <div
                                    className="bg-primary/55 transition-[width] duration-500"
                                    style={{
                                        width: `${percentages.organizations}%`,
                                    }}
                                />

                                <div
                                    className="bg-primary/25 transition-[width] duration-500"
                                    style={{
                                        width: `${percentages.administrators}%`,
                                    }}
                                />
                            </div>
                        </div>

                        {/* Metrics */}
                        <div className="mt-5 grid divide-y divide-border sm:mt-7 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                            {metrics.map((metric) => {
                                const Icon = metric.icon;

                                const percentage = total
                                    ? Math.round((metric.value / total) * 100)
                                    : 0;

                                return (
                                    <div
                                        key={metric.label}
                                        className={`
                                            flex items-center justify-between
                                            py-3
                                            first:pt-0
                                            last:pb-0
                                            sm:block
                                            sm:px-4
                                            sm:py-1
                                            sm:first:pl-0
                                            sm:last:pr-0
                                        `}
                                    >
                                        <div className="flex min-w-0 items-center gap-2">
                                            <Icon
                                                size={15}
                                                strokeWidth={1.7}
                                                className="shrink-0 text-primary"
                                            />

                                            <span className="truncate text-[9px] font-semibold uppercase tracking-[0.11em] text-text-secondary sm:text-[10px]">
                                                {metric.label}
                                            </span>
                                        </div>

                                        <div className="flex shrink-0 items-baseline gap-2 sm:mt-3">
                                            <span className="text-2xl font-semibold leading-none tracking-tight text-text-primary sm:text-[28px]">
                                                {metric.value}
                                            </span>

                                            <span className="text-[9px] font-medium text-text-secondary sm:text-[10px]">
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                SUMMARY STRIP
            ====================================================== */}
            <div className="flex flex-col gap-3 border border-t-0 border-border px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5 bg-white">
                <span className="text-[10px] font-medium text-text-secondary sm:text-xs">
                    Active platform composition
                </span>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
                    <span className="flex items-center gap-2 text-[10px] text-text-secondary sm:text-xs">
                        <span className="h-1.5 w-1.5 shrink-0 bg-primary" />
                        Individuals
                    </span>

                    <span className="flex items-center gap-2 text-[10px] text-text-secondary sm:text-xs">
                        <span className="h-1.5 w-1.5 shrink-0 bg-primary/55" />
                        Organizations
                    </span>

                    <span className="flex items-center gap-2 text-[10px] text-text-secondary sm:text-xs">
                        <span className="h-1.5 w-1.5 shrink-0 bg-primary/25" />
                        Administrators
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Stats;
