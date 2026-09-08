import React from 'react';

import { Megaphone } from 'lucide-react';

const CampaignIdentity = ({ campaign }) => {
    return (
        <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/7 text-primary">
                    <Megaphone className="h-4 w-4" strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-xs font-bold text-text-primary">
                        {campaign?.title || 'Untitled campaign'}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-text-secondary">
                        {campaign?.description ||
                            'Campaign details are not available.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CampaignIdentity;
