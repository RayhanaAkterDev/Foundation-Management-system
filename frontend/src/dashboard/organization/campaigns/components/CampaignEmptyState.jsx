import React from 'react';

import { Megaphone } from 'lucide-react';

const CampaignEmptyState = () => {
    return (
        <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/7 text-primary">
                <Megaphone className="h-5 w-5" strokeWidth={1.7} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-text-primary">
                No campaigns found
            </h3>

            <p className="mx-auto mt-1.5 max-w-sm text-xs leading-5 text-text-secondary">
                Create a campaign to start coordinating funding and support for
                a help request.
            </p>
        </div>
    );
};

export default CampaignEmptyState;
