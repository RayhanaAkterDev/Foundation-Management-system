import React from 'react';
import { TbDroplet, TbMapPin } from 'react-icons/tb';
import featuredCampaign from '@/assets/home/featuredCampaign.png';

// Components
import Badge from '@/components/Badge';
import CampaignHeader from './CampaignHeader';
import DonationCard from './DonationCard';
import ImpactRibbon from './ImpactRibbon';
import CampaignStory from './CampaignStory';

const FeaturedCampaign = () => {
    return (
        <section className="relative overflow-hidden section-gap">
            {/* ambient glow */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-0 h-130 w-130 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <div className="container-width">
                <CampaignHeader />

                {/* MAIN LAYOUT */}
                <div className="relative">
                    {/* IMAGE */}
                    <div className="relative overflow-hidden rounded-[40px]">
                        <img
                            src={featuredCampaign}
                            alt="Flood relief campaign"
                            className="h-150 w-full object-cover"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />

                        {/* BADGES */}
                        <div className="absolute left-7 top-7 flex flex-wrap gap-3">
                            <Badge variant="urgent" tone="glass" dot pulse>
                                Urgent
                            </Badge>

                            <Badge
                                variant="primary"
                                tone="solid"
                                icon={TbDroplet}
                            >
                                Flood Relief
                            </Badge>

                            <Badge
                                variant="default"
                                tone="glass"
                                icon={TbMapPin}
                            >
                                Khulna
                            </Badge>
                        </div>

                        {/* STORY */}
                        <CampaignStory />
                    </div>

                    {/* DONATION CARD */}
                    <DonationCard />
                </div>

                {/* IMPACT RIBBON */}
                <ImpactRibbon />
            </div>
        </section>
    );
};

export default FeaturedCampaign;
