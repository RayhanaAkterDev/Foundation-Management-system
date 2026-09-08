import React, { useMemo } from 'react';

import { CheckCircle2, Megaphone, Target, TrendingUp } from 'lucide-react';

const formatCurrency = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
};

const CampaignOverview = ({ campaigns }) => {
    const stats = useMemo(() => {
        const total = campaigns.length;

        const active = campaigns.filter(
            (campaign) =>
                String(campaign?.status || '').toLowerCase() === 'active',
        ).length;

        const completed = campaigns.filter(
            (campaign) =>
                String(campaign?.status || '').toLowerCase() === 'completed',
        ).length;

        const budget = campaigns.reduce(
            (sum, campaign) => sum + Number(campaign?.budget || 0),
            0,
        );

        return {
            total,
            active,
            completed,
            budget,
        };
    }, [campaigns]);

    const metrics = [
        {
            label: 'Total campaigns',
            value: stats.total,
            description: 'Across your organization',
            icon: Megaphone,
        },
        {
            label: 'Active campaigns',
            value: stats.active,
            description: 'Currently receiving support',
            icon: TrendingUp,
        },
        {
            label: 'Campaign budget',
            value: formatCurrency(stats.budget),
            description: 'Total allocated budget',
            icon: Target,
        },
        {
            label: 'Completed',
            value: stats.completed,
            description: 'Successfully concluded',
            icon: CheckCircle2,
        },
    ];

    return (
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                    <div
                        key={metric.label}
                        className="group rounded-2xl border border-border bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.035)] transition-shadow hover:shadow-[0_10px_30px_rgba(15,23,42,0.06)]"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-text-secondary">
                                    {metric.label}
                                </p>

                                <p className="mt-2 truncate text-2xl font-bold tracking-tight text-text-primary">
                                    {metric.value}
                                </p>

                                <p className="mt-1 text-[11px] text-text-secondary">
                                    {metric.description}
                                </p>
                            </div>

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/7 text-primary transition-colors group-hover:bg-primary/10">
                                <Icon className="h-4 w-4" strokeWidth={1.8} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </section>
    );
};

export default CampaignOverview;
