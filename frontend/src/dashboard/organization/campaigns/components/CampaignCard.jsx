import React from 'react';

import {
    ArrowUpRight,
    CalendarDays,
    DollarSign,
    HeartHandshake,
} from 'lucide-react';

import StatusBadge from '@/components/dashboard/StatusBadge';

import CampaignIdentity from './CampaignIdentity';

const formatCurrency = (value) => `₱${Number(value || 0).toLocaleString()}`;

const getProgress = (spent, budget) => {
    const total = Number(budget || 0);
    const current = Number(spent || 0);

    if (!total) return 0;

    return Math.min(Math.round((current / total) * 100), 100);
};

const CampaignCard = ({ campaign, onOpen }) => {
    const progress = getProgress(campaign?.spent, campaign?.budget);

    const helpRequestTitle =
        campaign?.helpRequestTitle ||
        campaign?.help_request?.title ||
        campaign?.help_request_title;

    return (
        <article className="group flex min-h-[300px] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[0_4px_20px_rgba(15,23,42,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_12px_30px_rgba(15,23,42,0.07)]">
            <div className="flex flex-1 flex-col p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                    <CampaignIdentity campaign={campaign} />

                    <StatusBadge status={campaign?.status} />
                </div>

                {/* Linked help request */}
                <div className="mt-4 rounded-xl border border-primary/10 bg-primary/[0.035] px-3.5 py-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <HeartHandshake
                                className="h-3.5 w-3.5"
                                strokeWidth={1.8}
                            />
                        </span>

                        <span className="min-w-0">
                            <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-primary">
                                Linked help request
                            </span>

                            <span className="mt-0.5 block truncate text-[11px] font-semibold text-text-primary">
                                {helpRequestTitle || 'No help request linked'}
                            </span>
                        </span>
                    </div>
                </div>

                {/* Funding */}
                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                            <DollarSign className="h-3.5 w-3.5 text-text-secondary" />

                            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                                Funding
                            </span>
                        </div>

                        <span className="text-[10px] font-bold text-text-primary">
                            {progress}%
                        </span>
                    </div>

                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[10px] font-medium text-text-primary">
                            {formatCurrency(campaign?.spent)}
                        </span>

                        <span className="text-[10px] text-text-secondary">
                            of {formatCurrency(campaign?.budget)}
                        </span>
                    </div>
                </div>

                {/* Meta */}
                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                    <div className="min-w-0">
                        <p className="text-[8px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                            Beneficiaries
                        </p>

                        <p className="mt-1 text-xs font-bold text-text-primary">
                            {campaign?.beneficiaries ?? 0}
                        </p>
                    </div>

                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-text-secondary">
                            <CalendarDays className="h-3 w-3" />

                            <span className="text-[8px] font-bold uppercase tracking-[0.1em]">
                                Deadline
                            </span>
                        </div>

                        <p className="mt-1 truncate text-xs font-bold text-text-primary">
                            {campaign?.deadline || '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end border-t border-border bg-slate-50/50 px-5 py-3">
                <button
                    type="button"
                    onClick={() => onOpen(campaign)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary transition-colors hover:text-primary-hover"
                >
                    View campaign
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
            </div>
        </article>
    );
};

export default CampaignCard;
