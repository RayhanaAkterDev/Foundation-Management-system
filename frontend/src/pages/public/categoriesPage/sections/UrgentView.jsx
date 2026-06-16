import React from 'react';
import { getUrgentCampaigns } from '@/data/selectors';
import CategoryGridPreview from './CategoryGridPreview';

const UrgentView = () => {
    return (
        <div className="space-y-6">
            <CategoryGridPreview campaigns={getUrgentCampaigns()} />
        </div>
    );
};

export default UrgentView;
