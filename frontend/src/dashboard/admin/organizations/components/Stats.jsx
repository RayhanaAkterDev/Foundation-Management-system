import React from 'react';

import {
    Building2,
    BadgeCheck,
    Clock3,
    XCircle,
    ArrowUpRight,
    ChevronRight,
} from 'lucide-react';

// ============================================================
// STATS
// ============================================================

const Stats = ({ total, verified, pending, rejected }) => {
    const totalCount = Number(total) || 0;
    const verifiedCount = Number(verified) || 0;
    const pendingCount = Number(pending) || 0;
    const rejectedCount = Number(rejected) || 0;

    const getPercentage = (value) => {
        if (!totalCount) return 0;
        return Math.round((value / totalCount) * 100);
    };

    const verifiedPercentage = getPercentage(verifiedCount);
    const pendingPercentage = getPercentage(pendingCount);
    const rejectedPercentage = getPercentage(rejectedCount);

    return (
        <section className="w-full overflow-hidden border border-border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.045)]">
            {/* ==================================================
                HEADER
            ================================================== */}
            <header className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between lg:px-7">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        <Building2 size={19} strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0">
                        <h2 className="truncate text-[14px] font-bold tracking-[-0.01em] text-text-primary sm:text-[15px]">
                            Organizations
                        </h2>

                        <p className="mt-0.5 truncate text-[10px] text-text-secondary sm:text-[11px]">
                            Registration and verification overview
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pl-13 md:pl-0">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.11em] text-text-secondary sm:text-[10px]">
                        Platform directory
                    </span>
                </div>
            </header>

            {/* ==================================================
                CONTENT
            ================================================== */}
            <div className="grid lg:grid-cols-[minmax(220px,0.85fr)_minmax(320px,1.55fr)_minmax(200px,0.75fr)]">
                {/* ==================================================
                    TOTAL
                ================================================== */}
                <div className="relative flex min-h-43.75 flex-col justify-between overflow-hidden border-b border-border px-4 py-5 sm:px-6 sm:py-6 lg:border-b-0 lg:border-r lg:px-7">
                    <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full border-22 border-primary/[0.035]" />

                    <div className="relative flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary sm:text-[10px]">
                            Total registered
                        </span>

                        <ArrowUpRight
                            size={14}
                            strokeWidth={1.8}
                            className="text-text-secondary"
                        />
                    </div>

                    <div className="relative mt-7 lg:mt-5">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                            <span className="text-[46px] font-bold leading-none tracking-[-0.055em] text-text-primary sm:text-[52px]">
                                {totalCount}
                            </span>

                            <span className="text-[10px] font-medium text-text-secondary sm:text-[11px]">
                                organizations
                            </span>
                        </div>

                        <div className="mt-3.5 flex flex-wrap items-center gap-2">
                            <span className="inline-flex min-h-5 items-center rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-700 sm:text-[9px]">
                                {verifiedPercentage}% verified
                            </span>

                            <span className="text-[9px] text-text-secondary sm:text-[10px]">
                                across the platform
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    VERIFICATION
                ================================================== */}
                <div className="min-w-0 border-b border-border px-4 py-5 sm:px-6 sm:py-6 lg:border-b-0 lg:border-r lg:px-7">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary sm:text-[10px]">
                                Verification status
                            </p>

                            <p className="mt-1 truncate text-[10px] text-text-secondary sm:text-[11px]">
                                Current organization distribution
                            </p>
                        </div>

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                            <BadgeCheck size={16} strokeWidth={1.8} />
                        </div>
                    </div>

                    {/* Distribution */}
                    <div className="mt-6">
                        <div className="flex h-2 overflow-hidden rounded-full bg-background-alt sm:h-2.5">
                            {verifiedPercentage > 0 && (
                                <div
                                    className="min-w-0 bg-emerald-500 transition-[width] duration-500"
                                    style={{
                                        width: `${verifiedPercentage}%`,
                                    }}
                                />
                            )}

                            {pendingPercentage > 0 && (
                                <div
                                    className="min-w-0 bg-amber-400 transition-[width] duration-500"
                                    style={{
                                        width: `${pendingPercentage}%`,
                                    }}
                                />
                            )}

                            {rejectedPercentage > 0 && (
                                <div
                                    className="min-w-0 bg-slate-400 transition-[width] duration-500"
                                    style={{
                                        width: `${rejectedPercentage}%`,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Status rows */}
                    <div className="mt-4 divide-y divide-border">
                        <StatusRow
                            label="Verified"
                            value={verifiedCount}
                            percentage={verifiedPercentage}
                            icon={BadgeCheck}
                            iconClass="text-emerald-600"
                            dotClass="bg-emerald-500"
                        />

                        <StatusRow
                            label="Pending review"
                            value={pendingCount}
                            percentage={pendingPercentage}
                            icon={Clock3}
                            iconClass="text-amber-600"
                            dotClass="bg-amber-400"
                        />

                        <StatusRow
                            label="Rejected"
                            value={rejectedCount}
                            percentage={rejectedPercentage}
                            icon={XCircle}
                            iconClass="text-slate-500"
                            dotClass="bg-slate-400"
                        />
                    </div>
                </div>

                {/* ==================================================
                    REVIEW QUEUE
                ================================================== */}
                <div className="flex min-h-43.75 flex-col justify-between bg-background-alt/45 px-4 py-5 sm:px-6 sm:py-6 lg:px-7">
                    <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-text-secondary sm:text-[10px]">
                            Review queue
                        </p>

                        <div className="mt-4 flex flex-wrap items-end gap-x-2 gap-y-1">
                            <span className="text-[42px] font-bold leading-none tracking-[-0.055em] text-text-primary sm:text-[46px]">
                                {pendingCount}
                            </span>

                            <span className="mb-1 text-[9px] font-semibold text-text-secondary sm:text-[10px]">
                                awaiting review
                            </span>
                        </div>

                        <div className="mt-4 flex items-start gap-2">
                            <span className="mt-0.5 h-6 w-1 shrink-0 rounded-full bg-amber-400" />

                            <p className="max-w-55 text-[9px] leading-[1.55] text-text-secondary sm:text-[10px]">
                                Organizations requiring verification before
                                becoming trusted.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="group mt-5 flex w-full items-center justify-between border-t border-border pt-3.5 text-left"
                    >
                        <span className="text-[9px] font-bold text-text-primary transition-colors group-hover:text-primary sm:text-[10px]">
                            Open review queue
                        </span>

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-text-secondary shadow-sm ring-1 ring-inset ring-border transition-all group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                            <ChevronRight size={14} strokeWidth={2} />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

// ============================================================
// STATUS ROW
// ============================================================

const StatusRow = ({
    label,
    value,
    percentage,
    icon: Icon,
    iconClass,
    dotClass,
}) => {
    return (
        <div className="flex min-w-0 items-center justify-between gap-3 py-2.5 sm:py-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                <Icon
                    size={14}
                    strokeWidth={1.9}
                    className={`shrink-0 ${iconClass}`}
                />

                <span className="truncate text-[10px] font-semibold text-text-primary sm:text-[11px]">
                    {label}
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
                <span className="text-[9px] font-medium text-text-secondary sm:text-[10px]">
                    {percentage}%
                </span>

                <div className="flex min-w-9.5 items-center justify-end gap-1.5 sm:min-w-12">
                    <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`}
                    />

                    <span className="text-[10px] font-bold text-text-primary sm:text-[11px]">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Stats;
