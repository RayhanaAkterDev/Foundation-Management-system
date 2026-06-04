import React from 'react';

// Icons (external libraries)
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Reusable/shared components
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

// Asset
import campaignsHeroImage from '@/assets/campaigns/campaignsHeroImage.png';

const HeroSection = () => {
    return (
        <>
            <section className="section-gap mt-20 bg-surface">
                <div className="container-width">
                    {/* Heading */}
                    <SectionHeading
                        gap="lg"
                        badge={{
                            label: 'Active Campaigns',
                            variant: 'accent',
                            tone: 'soft',
                            size: 'lg',
                        }}
                        title={
                            <>
                                Support verified causes{' '}
                                <span className="block text-primary">
                                    making a real impact today.
                                </span>
                            </>
                        }
                        headingSize="hero"
                        description={
                            <>
                                Explore verified campaigns, respond to urgent
                                needs, and{' '}
                                <span className="inline lg:block">
                                    stand with people when it matters most.
                                </span>
                            </>
                        }
                        descriptionSize="hero"
                        descriptionClass="w-full!"
                    />

                    {/* CTA */}
                    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Button size="lg">
                            <TbHeartFilled />
                            Browse Urgent Cases
                        </Button>
                        <Button
                            variant="outline"
                            className="justify-center"
                            size="lg"
                        >
                            Become a Volunteer
                            <HiArrowSmRight className="mt-0.5" />
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-secondary">
                        <div>✓ Verified Requests</div>
                        <div>✓ Transparent Progress Tracking</div>
                        <div>✓ AI-Assisted Prioritization</div>
                    </div>

                    {/* Image */}
                    <div className="section-gap flex flex-col gap-20">
                        <div className="rounded-4xl">
                            <img
                                src={campaignsHeroImage}
                                alt="campaignsHeroImage"
                                className="w-full h-120 rounded-4xl object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;
