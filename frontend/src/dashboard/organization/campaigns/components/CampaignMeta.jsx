import React from 'react';

import { CalendarDays, Target } from 'lucide-react';

const CampaignMeta = ({ campaign }) => {
    return (
        <div className="grid grid-cols-2 gap-3 border-t border-border pt-4">
            <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-text-secondary">
                    <Target className="h-3.5 w-3.5" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                        Beneficiaries
                    </span>
                </div>

                <p className="mt-1 text-xs font-semibold text-text-primary">
                    {campaign?.beneficiaries ?? 0}
                </p>
            </div>

            <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-text-secondary">
                    <CalendarDays className="h-3.5 w-3.5" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.1em]">
                        Deadline
                    </span>
                </div>

                <p className="mt-1 truncate text-xs font-semibold text-text-primary">
                    {campaign?.deadline || '—'}
                </p>
            </div>
        </div>
    );
};

export default CampaignMeta;
