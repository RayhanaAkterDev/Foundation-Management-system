import React from 'react';
import HeroSection from './sections/HeroSection';
import CampaignToolbar from './sections/CampaignToolbar';
// import CampaignLoadMore from './sections/CampaignLoadMore';
import CampaignGrid from './sections/campaignGrid/CampaignGrid';

const Campaigns = () => {
    return (
        <>
            <HeroSection />
            <CampaignToolbar />
        </>
    );
};

export default Campaigns;
