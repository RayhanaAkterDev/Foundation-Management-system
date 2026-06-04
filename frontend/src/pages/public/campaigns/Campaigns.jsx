import React from 'react';
import HeroSection from './sections/HeroSection';
import CampaignStats from './sections/CampaignStats';
import CampaignToolbar from './sections/CampaignToolbar';
import CampaignGrid from './sections/CampaignGrid';
import CampaignLoadMore from './sections/CampaignLoadMore';

const Campaigns = () => {
    return (
        <>
            <HeroSection />
            <CampaignStats />
            <CampaignToolbar />
            <CampaignGrid />
            <CampaignLoadMore />
        </>
    );
};

export default Campaigns;
