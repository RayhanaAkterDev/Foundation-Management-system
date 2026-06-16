import React from 'react';
import { Link } from 'react-router-dom';

import { getFeaturedCampaign } from '@/data/selectors';

import CampaignHeader from './CampaignHeader';
import DonationCard from './DonationCard';
import CampaignStory from './CampaignStory';

const FeaturedCampaign = () => {
    const campaign = getFeaturedCampaign();

    if (!campaign) return null;

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

                        {/* CLICKABLE AREA */}
                        <Link
                            to={`/campaign/${campaign.id}`}
                            className="absolute inset-0 z-10"
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
