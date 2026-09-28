import React, { useEffect, useState } from 'react';
import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';

import DonateHero from './components/DonateHero';
import UrgentSection from './components/UrgentSection';
import FeaturedSection from './components/FeaturedSection';
import CategoryQuickAccess from './components/CategoryQuickAccess.jsx';
import BrowseCTA from './components/BrowseCTA';

const DonateHub = () => {
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        let isMounted = true;

        const loadCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();

                const activeCampaigns = [...data]
                    .filter((campaign) => campaign?.status === 'active')
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    );

                if (isMounted) {
                    setCampaigns(activeCampaigns);
                }
            } catch (error) {
                console.error('Failed to load donation hub campaigns:', error);

                if (isMounted) {
                    setCampaigns([]);
                }
            }
        };

        loadCampaigns();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <DonateHero />
            <UrgentSection campaigns={campaigns} />
            <FeaturedSection campaigns={campaigns} />
            <CategoryQuickAccess />
            <BrowseCTA />
        </>
    );
};

export default DonateHub;
