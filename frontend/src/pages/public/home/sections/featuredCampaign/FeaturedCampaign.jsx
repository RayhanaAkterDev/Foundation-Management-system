import React from 'react';
import featuredCampaign from '@/assets/home/featuredCampaign/featuredCampaign.png';

// Components
import CampaignHeader from './CampaignHeader';
import DonationCard from './DonationCard';
import CampaignStory from './CampaignStory';

const FeaturedCampaign = () => {
    return (
        <section className="relative section-gap pb-12 md:pb-30">
            <div className="container-width">
                <CampaignHeader />

                <div className="relative">
                    <div className="relative overflow-hidden rounded-[40px]">
                        <img
                            src={featuredCampaign}
                            className="h-150 w-full object-cover"
                            alt=""
                        />

                        {/* STORY OVERLAY */}
                        <CampaignStory />
                    </div>

                    {/* DONATION CARD */}
                    <div className="mt-6 flex justify-center lg:justify-end lg:px-0 lg:pr-20">
                        <DonationCard />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCampaign;
