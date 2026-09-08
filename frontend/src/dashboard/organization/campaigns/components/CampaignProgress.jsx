import React from 'react';

import { DollarSign } from 'lucide-react';

const formatCurrency = (value) => {
    return `₱${Number(value || 0).toLocaleString()}`;
};

const getProgress = (spent, budget) => {
    const total = Number(budget || 0);
    const current = Number(spent || 0);

    if (!total) {
        return 0;
    }

    return Math.min(Math.round((current / total) * 100), 100);
};

const CampaignProgress = ({ campaign }) => {
    const progress = getProgress(campaign?.spent, campaign?.budget);

    return (
        <div>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-text-secondary" />

                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-text-secondary">
                        Funding
                    </span>
                </div>

                <span className="text-[11px] font-bold text-text-primary">
                    {progress}%
                </span>
            </div>

            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-[10px] text-text-secondary">
                    {formatCurrency(campaign?.spent)} raised
                </span>

                <span className="text-[10px] font-medium text-text-secondary">
                    of {formatCurrency(campaign?.budget)}
                </span>
            </div>
        </div>
    );
};

export default CampaignProgress;
