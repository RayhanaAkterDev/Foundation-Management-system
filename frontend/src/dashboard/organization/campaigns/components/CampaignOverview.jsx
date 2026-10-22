import React, { useMemo } from 'react';
import {
    Megaphone,
    Clock3,
    BadgeCheck,
    CircleCheck,
    XCircle,
    Ban,
} from 'lucide-react';

const STATUS = [
    {
        key: 'unverified',
        label: 'Unverified',
        icon: Clock3,
        color: '#C5A16D',
        background: '#29251F',
    },
    {
        key: 'active',
        label: 'Active',
        icon: BadgeCheck,
        color: '#91B9B0',
        background: '#1B2A2A',
    },
    {
        key: 'cancelled',
        label: 'Cancelled',
        icon: Ban,
        color: '#91A9CC',
        background: '#202B3D',
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

const CampaignOverview = ({ campaigns = [] }) => {
    const stats = useMemo(() => {
        const list = Array.isArray(campaigns) ? campaigns : [];

        const counts = Object.fromEntries(
            STATUS.map(({ key }) => [
                key,
                list.filter(
                    (campaign) =>
                        String(campaign?.status || '').toLowerCase() === key,
                ).length,
            ]),
        );

        return {
            total: list.length,
            ...counts,
        };
    }, [campaigns]);

    return (
        <section>
            <div className="mb-5 min-w-0 sm:mb-6">
                <h2
                    id="campaign-overview-heading"
                    className="font-sans! text-[18px]! font-semibold! leading-tight tracking-[-0.02em] text-[#EEF1F5]!"
                >
                    Campaigns overview
                </h2>
            </div>

            <div
                aria-label="Campaign statistics"
                className="min-w-0 overflow-hidden border border-[#29323E] bg-[#0E1219]"
            >
                <div className="grid min-w-0 lg:grid-cols-[minmax(220px,26%)_minmax(0,1fr)]">
                    <div className="flex min-w-0 flex-col justify-between border-b border-[#29323E] bg-[#19212C] px-5 py-6 sm:px-7 lg:border-b-0 lg:border-r lg:py-6">
                        <div>
                            <div className="flex items-center gap-2.5">
                                <span className="flex h-8 w-8 items-center justify-center border border-[#384453] bg-[#202B38] text-[#B4C0CE]">
                                    <Megaphone size={16} strokeWidth={1.8} />
                                </span>

                                <h3 className="text-[15px]! font-semibold! tracking-[-0.02em] text-[#E5EAF0]!">
                                    Campaigns
                                </h3>
                            </div>

                            <p className="mt-5 text-[10px] font-semibold! uppercase tracking-[0.12em] text-[#8492A5]">
                                Total campaigns
                            </p>

                            <div className="mt-2 flex items-end gap-2.5">
                                <span className="text-[58px] font-semibold! leading-none tracking-[-0.065em] tabular-nums text-[#EEF1F5] sm:text-[66px]">
                                    {stats.total}
                                </span>

                                <span className="mb-1.5 text-[12px] text-[#91A0B3]">
                                    campaigns
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-[#35404D] pt-3.5 text-[11px] text-[#91A0B3]">
                            Across{' '}
                            <span className="font-medium! text-[#D6DDE6]">
                                {STATUS.length} workflow statuses
                            </span>
                        </div>
                    </div>

                    <div className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h3 className="text-[13px]! font-semibold! text-[#DDE4ED]!">
                                Campaign status
                            </h3>

                            <span className="text-[10px] text-[#718096]">
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
                                    const count = stats[key];
                                    const percentage =
                                        stats.total > 0
                                            ? (count / stats.total) * 100
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

                                                <span className="truncate text-[12px] font-medium! text-[#CDD6E1]">
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

                                            <span className="text-right text-[19px] font-semibold! tabular-nums text-[#E2E8F0]">
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
};

export default CampaignOverview;
