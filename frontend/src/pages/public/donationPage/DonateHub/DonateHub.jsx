import React, { useMemo } from 'react';

import { getFeaturedCampaigns, getUrgentCampaigns } from '@/data/selectors';

import DonateHero from './components/DonateHero';
import UrgentSection from './components/UrgentSection';
import FeaturedSection from './components/FeaturedSection';
import CategoryQuickAccess from './components/CategoryQuickAccess.jsx';
import BrowseCTA from './components/BrowseCTA';

const DonateHub = () => {
    const featured = useMemo(() => getFeaturedCampaigns(), []);
    const urgent = useMemo(() => getUrgentCampaigns(), []);

    return (
        <>
            <DonateHero />
            <UrgentSection campaigns={urgent} />
            <FeaturedSection campaigns={featured} />
            <CategoryQuickAccess />

            <BrowseCTA />
        </>
    );
};

export default DonateHub;
