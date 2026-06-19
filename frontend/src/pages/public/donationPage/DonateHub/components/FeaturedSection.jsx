import React from 'react';
import { TbHeartHandshake } from 'react-icons/tb';
import CampaignCard from '../../../campaignsPage/sections/CampaignCard.jsx';
import SectionHeading from '@/components/SectionHeading.jsx';

const FeaturedSection = ({ campaigns = [] }) => {
    const featured = (campaigns || []).slice(0, 3);

    return (
        <section className="section-gap">
            <div className="container-width space-y-8">
                <SectionHeading
                    gap="sm"
                    align="left"
                    title="Featured Campaigns"
                    description="Carefully selected stories where your support creates
                        real-world impact."
                    descriptionSize="hero"
                />

                {/* CONTENT */}
                {featured.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.map((c) => (
                            <CampaignCard key={c.id} campaign={c} />
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center rounded-xl border border-border bg-surface text-sm text-text-secondary">
                        No featured stories available right now.
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSection;
