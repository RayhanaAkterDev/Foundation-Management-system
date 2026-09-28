import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { fetchPublicCampaigns } from '@/api/publicCampaignsApi';

import CampaignHeader from './CampaignHeader';

import DonationCard from './DonationCard';

import CampaignStory from './CampaignStory';

const FeaturedCampaign = () => {
    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadFeaturedCampaign = async () => {
            try {
                const campaigns = await fetchPublicCampaigns();

                const latestCampaign = [...campaigns]
                    .filter((item) => item?.status === 'active')
                    .sort(
                        (a, b) =>
                            new Date(b.created_at) - new Date(a.created_at),
                    )[0];

                if (isMounted) {
                    setCampaign(latestCampaign || null);
                }
            } catch (error) {
                console.error('Failed to load featured campaign:', error);

                if (isMounted) {
                    setCampaign(null);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadFeaturedCampaign();

        return () => {
            isMounted = false;
        };
    }, []);

    if (loading || !campaign) {
        return null;
    }

    return (
        <section className="relative section-gap pb-12 md:pb-30">
            <div className="container-width">
                <CampaignHeader />

                <div className="relative">
                    <div className="relative overflow-hidden rounded-[40px]">
                        <img
                            src={campaign.image}
                            className="h-150 w-full object-cover"
                            alt={campaign.title}
                        />

                        <CampaignStory campaign={campaign} />

                        <Link
                            to={`/campaign/${campaign.id}`}
                            className="absolute inset-0 z-10"
                            aria-label={`${campaign.title} ক্যাম্পেইন দেখুন`}
                        />
                    </div>

                    <div className="mt-6 flex justify-center lg:justify-end lg:px-0 lg:pr-20">
                        <DonationCard campaign={campaign} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCampaign;
