import React from 'react';

import { TbHeartHandshake } from 'react-icons/tb';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                    description="Carefully selected stories where your support creates real-world impact."
                    descriptionSize="hero"
                />

                {/* CONTENT */}
                {featured.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featured.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            ))}
                        </div>

                        {/* SEE MORE */}
                        <div className="flex justify-center pt-2">
                            <Link
                                to="/campaigns/featured"
                                className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-6 py-3 font-sans text-sm font-semibold text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-white!"
                            >
                                See More
                                <ArrowRight
                                    size={16}
                                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                                />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="rounded-xl border border-border bg-surface py-12 text-center text-sm text-text-secondary">
                        No featured stories available right now.
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSection;
