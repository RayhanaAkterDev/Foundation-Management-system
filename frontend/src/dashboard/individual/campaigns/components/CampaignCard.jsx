import React from 'react';

import { ArrowRight, Megaphone } from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

const formatCurrency = (amount) => {
    return `৳${Number(amount || 0).toLocaleString('en-BD')}`;
};

const CampaignCard = ({ campaign, onDonate }) => {
    const targetAmount = Number(campaign.target_amount || 0);
    const collectedAmount = Number(campaign.collected_amount || 0);

    const progress =
        targetAmount > 0
            ? Math.min(Math.round((collectedAmount / targetAmount) * 100), 100)
            : 0;

    const remainingAmount = Math.max(targetAmount - collectedAmount, 0);

    const formatDate = (date) => {
        if (!date) return 'No deadline';

        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#252D38] bg-[#0E1219]  transition duration-300 hover:-translate-y-0.5 hover:border-[#465261] ">
            <div className="relative overflow-hidden bg-[#1A222D] px-6 pb-7 pt-6 sm:px-7">
                <div className="relative flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0E1219]/10 text-[#EEF1F5] ring-1 ring-white/15">
                            <Megaphone
                                className="h-4.5 w-4.5"
                                strokeWidth={1.8}
                            />
                        </div>

                        <div className="min-w-0">
                            {campaign.category && (
                                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#8792A1]">
                                    {campaign.category}
                                </p>
                            )}

                            <h2 className="text-[18px] font-semibold leading-6 tracking-tight text-[#EEF1F5]">
                                {campaign.title}
                            </h2>
                        </div>
                    </div>

                    <div className="shrink-0 [&_span]:border-white/20! [&_span]:bg-[#0E1219]/10! [&_span]:text-[#EEF1F5]">
                        <StatusBadge status={campaign.status} />
                    </div>
                </div>
            </div>

            <div className="flex flex-1 flex-col px-6 py-6 sm:px-7">
                {campaign.description && (
                    <p className="line-clamp-3 text-sm leading-6 text-[#8792A1]">
                        {campaign.description}
                    </p>
                )}

                <div className="mt-6 rounded-xl border border-[#252D38] bg-[#151C25]">
                    <div className="flex items-end justify-between gap-4 px-5 py-4">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8792A1]">
                                Raised
                            </p>

                            <p className="mt-1 font-display text-[28px] font-semibold leading-none tracking-tight text-[#EEF1F5]">
                                {formatCurrency(collectedAmount)}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8792A1]">
                                Goal
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#B8C2CF]">
                                {formatCurrency(targetAmount)}
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-[#252D38] px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs font-semibold text-[#5EEAD4]">
                                {progress}% funded
                            </span>

                            <span className="text-[11px] font-medium! text-[#8792A1]">
                                {remainingAmount > 0
                                    ? `${formatCurrency(remainingAmount)} needed`
                                    : 'Goal reached'}
                            </span>
                        </div>

                        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-[#303A47]">
                            <div
                                className="h-full rounded-full bg-[#0F766E] transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#252D38] pt-4">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8792A1]">
                            Campaign deadline
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#B8C2CF]">
                            {formatDate(campaign.end_date)}
                        </p>
                    </div>

                    <span className="text-xs font-medium! text-[#8792A1]">
                        {progress >= 100 ? 'Fully funded' : 'Open for support'}
                    </span>
                </div>
            </div>

            <div className="border-t border-[#252D38] bg-[#151C25] px-6 py-4 sm:px-7">
                <button
                    type="button"
                    onClick={() => onDonate(campaign)}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0F766E] text-sm font-semibold text-white! shadow-sm transition hover:bg-[#0F766E]-hover hover:shadow-md"
                >
                    Support this campaign
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </button>
            </div>
        </article>
    );
};

export default CampaignCard;
