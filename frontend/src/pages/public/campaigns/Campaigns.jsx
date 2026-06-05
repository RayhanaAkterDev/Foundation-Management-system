import React from 'react';
import HeroSection from './sections/HeroSection';
import CampaignToolbar from './sections/CampaignToolbar';
// import CampaignLoadMore from './sections/CampaignLoadMore';
import CampaignGrid from './sections/campaignGrid/CampaignGrid';
import ActiveCampaigns from './sections/campaignGrid/ActiveCampaigns';

const Campaigns = () => {
    return (
        <>
            <HeroSection />
            <CampaignToolbar />
            <ActiveCampaigns />
        </>
    );
};

export default Campaigns;
