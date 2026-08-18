import React from 'react';
import {
    Megaphone,
    BadgeCheck,
    Clock3,
    PlayCircle,
    CircleCheck,
    XCircle,
} from 'lucide-react';

const CampaignStats = ({
    total,
    verified,
    pending,
    active,
    completed,
    rejected,
}) => {
    return (
        <section className="overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_2.85fr]">
                {/* Primary metric */}
                <div className="relative overflow-hidden bg-primary px-6 py-7 text-white sm:px-7">
                    <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/5" />
                    <div className="absolute -bottom-16 right-8 h-40 w-40 rounded-full bg-white/5" />

                    <div className="relative flex h-full flex-col">
                        <div className="flex items-center justify-between">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12">
                                <Megaphone size={20} strokeWidth={1.8} />
                            </div>

                            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/60">
                                All campaigns
                            </span>
                        </div>

                        <div className="mt-auto pt-10">
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/65">
                                Total campaigns
                            </p>

                            <p className="mt-1 text-4xl font-bold tracking-tight sm:text-5xl">
                                {total}
                            </p>

                            <p className="mt-2 max-w-55 text-xs leading-5 text-white/65">
                                Total campaigns submitted across the platform.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Supporting metrics */}
                <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                    <StatItem label="Pending" value={pending} icon={Clock3} />

                    <StatItem
                        label="Verified"
                        value={verified}
                        icon={BadgeCheck}
                    />

                    <StatItem label="Active" value={active} icon={PlayCircle} />

                    <StatItem
                        label="Completed"
                        value={completed}
                        icon={CircleCheck}
                    />

                    <StatItem
                        label="Rejected"
                        value={rejected}
                        icon={XCircle}
                    />

                    {/* Empty balancing cell */}
                    <div className="hidden sm:block" />
                </div>
            </div>
        </section>
    );
};

const StatItem = ({ label, value, icon: Icon }) => {
    return (
        <div className="flex min-h-35 items-center px-6 py-6 transition-colors hover:bg-background-alt/35">
            <div className="flex w-full items-start justify-between gap-4">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                        {label}
                    </p>

                    <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">
                        {value}
                    </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary">
                    <Icon size={17} strokeWidth={1.8} />
                </div>
            </div>
        </div>
    );
};

export default CampaignStats;
