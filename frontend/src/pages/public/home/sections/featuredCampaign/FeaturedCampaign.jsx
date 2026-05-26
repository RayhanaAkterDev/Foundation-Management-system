import React from 'react';
import CampaignCategoryNav from './CampaignCategoryNav';
import FeaturedCampaignMain from './FeaturedCampaignHero';
import FeaturedMiniGrid from './FeaturedMiniGrid';
import SectionHeading from '@/components/SectionHeading';
import { TbHeartFilled } from 'react-icons/tb';

const FeaturedCampaign = () => {
    return (
        <section className="section-gap bg-background">
            <div className="container-width">
                {/* section heading */}
                <SectionHeading
                    gap="sm"
                    align="center"
                    headingTag="h2"
                    badge="Featured Campaign"
                    badgeIcon={TbHeartFilled}
                    title="Make an impact where it matter most"
                    description="Join thousands of people supporting urgent causes and creating real change."
                />

                {/* section body */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-12">
                    {/* sidebar */}
                    <CampaignCategoryNav />

                    {/* main content */}
                    <div className="lg:col-span-9 space-y-6">
                        <FeaturedCampaignMain />
                        <FeaturedMiniGrid />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturedCampaign;
