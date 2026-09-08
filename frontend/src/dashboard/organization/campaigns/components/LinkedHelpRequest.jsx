import React from 'react';

import { HeartHandshake } from 'lucide-react';

const LinkedHelpRequest = ({ campaign }) => {
    const helpRequestTitle =
        campaign?.helpRequestTitle ||
        campaign?.help_request?.title ||
        campaign?.help_request_title;

    return (
        <div className="rounded-xl border border-primary/10 bg-primary/[0.035] px-4 py-3">
            <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HeartHandshake className="h-3.5 w-3.5" strokeWidth={1.8} />
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-primary">
                    Linked help request
                </span>
            </div>

            <p className="mt-2 truncate text-xs font-semibold text-text-primary">
                {helpRequestTitle || 'No help request linked'}
            </p>
        </div>
    );
};

export default LinkedHelpRequest;
