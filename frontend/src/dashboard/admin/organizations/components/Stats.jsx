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
        <section className="overflow-hidden rounded-[24px] border border-border bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            {/* ==================================================
                TOP HEADER
            ================================================== */}
            <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:px-7 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.08] text-primary">
                        <Building2 size={19} strokeWidth={1.8} />
                    </div>

                    <div>
                        <h2 className="text-[15px] font-bold tracking-[-0.015em] text-text-primary">
                            Organizations
                        </h2>

                        <p className="mt-0.5 text-[11px] text-text-secondary">
                            Registration and verification overview
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.11em] text-text-secondary">
                        Platform directory
                    </span>
                </div>
            </div>

            {/* ==================================================
                MAIN CONTENT
            ================================================== */}
            <div className="grid lg:grid-cols-[0.9fr_1.6fr_0.75fr]">
                {/* ==================================================
                    TOTAL
                ================================================== */}
                <div className="relative flex min-h-[190px] flex-col justify-between overflow-hidden border-b border-border px-6 py-6 sm:px-7 lg:border-b-0 lg:border-r">
                    <div className="absolute -bottom-16 -right-16 h-40 w-40 rounded-full border-[24px] border-primary/[0.035]" />

                    <div className="relative flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                            Total registered
                        </span>

                        <ArrowUpRight
                            size={15}
                            strokeWidth={1.8}
                            className="text-text-secondary"
                        />
                    </div>

                    <div className="relative">
                        <div className="flex items-baseline gap-2">
                            <span className="text-[54px] font-bold leading-none tracking-[-0.06em] text-text-primary">
                                {totalCount}
                            </span>

                            <span className="text-[11px] font-medium text-text-secondary">
                                organizations
                            </span>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <span className="inline-flex h-5 items-center rounded-full bg-emerald-50 px-2 text-[9px] font-bold text-emerald-700">
                                {verifiedPercentage}% verified
                            </span>

                            <span className="text-[10px] text-text-secondary">
                                across the platform
                            </span>
                        </div>
                    </div>
                </div>

                {/* ==================================================
                    VERIFICATION DISTRIBUTION
                ================================================== */}
                <div className="border-b border-border px-6 py-6 sm:px-7 lg:border-b-0 lg:border-r">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                                Verification status
                            </p>

                            <p className="mt-1 text-[12px] text-text-secondary">
                                Current organization distribution
                            </p>
                        </div>

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background-alt text-text-secondary">
                            <BadgeCheck size={16} strokeWidth={1.8} />
                        </div>
                    </div>

                    {/* Distribution bar */}
                    <div className="mt-7">
                        <div className="flex h-2.5 overflow-hidden rounded-full bg-background-alt">
                            {verifiedPercentage > 0 && (
                                <div
                                    className="bg-emerald-500"
                                    style={{
                                        width: `${verifiedPercentage}%`,
                                    }}
                                />
                            )}

                            {pendingPercentage > 0 && (
                                <div
                                    className="bg-amber-400"
                                    style={{
                                        width: `${pendingPercentage}%`,
                                    }}
                                />
                            )}

                            {rejectedPercentage > 0 && (
                                <div
                                    className="bg-slate-400"
                                    style={{
                                        width: `${rejectedPercentage}%`,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Status list */}
                    <div className="mt-5 divide-y divide-border">
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
                <div className="relative flex min-h-[190px] flex-col justify-between bg-background-alt/45 px-6 py-6 sm:px-7">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-secondary">
                            Review queue
                        </p>

                        <div className="mt-5 flex items-end gap-2">
                            <span className="text-[46px] font-bold leading-none tracking-[-0.055em] text-text-primary">
                                {pendingCount}
                            </span>

                            <span className="mb-1 text-[10px] font-semibold text-text-secondary">
                                awaiting review
                            </span>
                        </div>

                        <div className="mt-4 flex items-start gap-2.5">
                            <div className="mt-0.5 h-7 w-1 rounded-full bg-amber-400" />

                            <p className="text-[10px] leading-[1.55] text-text-secondary">
                                Organizations in this queue require verification
                                before becoming trusted.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="group mt-6 flex w-full items-center justify-between border-t border-border pt-4 text-left"
                    >
                        <span className="text-[10px] font-bold text-text-primary transition-colors group-hover:text-primary">
                            Open review queue
                        </span>

                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-text-secondary shadow-sm ring-1 ring-inset ring-border transition-all group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
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
        <div className="flex items-center justify-between gap-4 py-3">
            <div className="flex min-w-0 items-center gap-2.5">
                <Icon
                    size={15}
                    strokeWidth={1.9}
                    className={`shrink-0 ${iconClass}`}
                />

                <span className="truncate text-[11px] font-semibold text-text-primary">
                    {label}
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <span className="text-[10px] font-medium text-text-secondary">
                    {percentage}%
                </span>

                <div className="flex min-w-[48px] items-center justify-end gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />

                    <span className="text-[11px] font-bold text-text-primary">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Stats;
