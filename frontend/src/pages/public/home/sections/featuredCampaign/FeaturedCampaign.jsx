import React from 'react';
import { TbCalendar, TbDroplet, TbMapPin } from 'react-icons/tb';
import featuredCampaign from '@/assets/home/featuredCampaign/featuredCampaign.png';

// Components
import Badge from '@/components/Badge';
import CampaignHeader from './CampaignHeader';
import DonationCard from './DonationCard';
import CampaignStory from './CampaignStory';

const FeaturedCampaign = () => {
    return (
        <section className="relative overflow-hidden section-gap pb-48!">
            <div className="container-width">
                <CampaignHeader />

                <div className="relative">
                    {/* IMAGE */}
                    <div className="relative overflow-hidden rounded-[40px]">
                        <img
                            src={featuredCampaign}
                            alt="Flood relief campaign"
                            className="h-150 w-full object-cover"
                        />

                        {/* Overlay */}
                        <>
                            <div className="absolute inset-0 bg-black/25" />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                        </>

                        {/* STORY */}
                        <CampaignStory />
                    </div>

                    {/* DONATION CARD */}
                    <DonationCard />
                </div>
            </div>
        </section>
    );
};

export default FeaturedCampaign