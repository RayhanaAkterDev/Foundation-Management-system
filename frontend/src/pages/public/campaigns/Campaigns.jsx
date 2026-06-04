import React from 'react';
import HeroSection from './sections/HeroSection';
import CampaignToolbar from './sections/CampaignToolbar';
import CampaignLoadMore from './sections/CampaignLoadMore';

const Campaigns = () => {
    return (
        <>
            <HeroSection />
            <CampaignToolbar />
            <CampaignLoadMore />
        </>
    );
};

export default Campaigns;
