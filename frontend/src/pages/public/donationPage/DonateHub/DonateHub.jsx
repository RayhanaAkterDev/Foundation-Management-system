import React, { useEffect, useState } from 'react';
import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';

import DonateHero from './components/DonateHero';
import UrgentSection from './components/UrgentSection';
import FeaturedSection from './components/FeaturedSection';
import CategoryQuickAccess from './components/CategoryQuickAccess.jsx';
import BrowseCTA from './components/BrowseCTA';

const DonateHub = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const [campaignsError, setCampaignsError] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadCampaigns = async () => {
            try {
                const data = await fetchPublicCampaigns();

                const campaignList = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                      ? data.data
                      : Array.isArray(data?.campaigns)
                        ? data.campaigns
                        : [];

                const activeCampaigns = campaignList
                    .filter((campaign) => campaign?.status === 'active')
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    );

                if (isMounted) {
                    setCampaigns(activeCampaigns);
                    setCampaignsError(null);
                }
            } catch (error) {
                console.error('Failed to load donation hub campaigns:', error);

                if (isMounted) {
                    setCampaigns([]);
                    setCampaignsError(
                        'ক্যাম্পেইনগুলো লোড করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
                    );
                }
            } finally {
                if (isMounted) {
                    setCampaignsLoading(false);
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

            <UrgentSection
                campaigns={campaigns}
                loading={campaignsLoading}
                error={campaignsError}
            />

            <FeaturedSection
                campaigns={campaigns}
                loading={campaignsLoading}
                error={campaignsError}
            />

            <CategoryQuickAccess />

            <BrowseCTA />
        </>
    );
};

export default DonateHub;
