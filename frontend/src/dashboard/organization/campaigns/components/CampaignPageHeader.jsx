import React from 'react';

import { Plus } from 'lucide-react';

import PageHeader from '@/components/dashboard/PageHeader';

const CampaignPageHeader = ({ onCreate }) => {
    return (
        <PageHeader
            title="Campaigns"
            subtitle="Coordinate funding, track progress, and manage campaigns supporting people in need."
            action={
                <button
                    type="button"
                    onClick={onCreate}
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
                >
                    <Plus className="h-4 w-4" />
                    New campaign
                </button>
            }
        />
    );
};

export default CampaignPageHeader;
