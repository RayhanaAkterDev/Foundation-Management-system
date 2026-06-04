import React from 'react';
import HeroSection from './sections/HeroSection';
import CampaignToolbar from './sections/CampaignToolbar';
import CampaignGrid from './sections/campaignGrid/CampaignGrid';
import CampaignLoadMore from './sections/CampaignLoadMore';

const Campaigns = () => {
    return (
        <>
            <HeroSection />
            <CampaignToolbar />
            <CampaignGrid />
            <CampaignLoadMore />
        </>
    );
};

export default Campaigns;
