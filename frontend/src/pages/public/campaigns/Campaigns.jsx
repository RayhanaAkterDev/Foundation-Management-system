import React from 'react';
import HeroSection from './sections/HeroSection';
import CampaignContainer from './sections/campaignContainer/campaignContainer';
import Stats from './sections/Stats';

const Campaigns = () => {
    return (
        <>
            <HeroSection />
            <CampaignContainer />
            <Stats />
        </>
    );
};

export default Campaigns;
