import React from 'react';

import CampaignCard from './CampaignCard';
import CampaignEmptyState from './CampaignEmptyState';

const CampaignList = ({ campaigns, onOpen }) => {
    if (!campaigns.length) {
        return <CampaignEmptyState />;
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {campaigns.map((campaign) => (
                <CampaignCard
                    key={campaign?.id}
                    campaign={campaign}
                    onOpen={onOpen}
                />
            ))}
        </div>
    );
};

export default CampaignList;
