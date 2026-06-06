import React from 'react';

// Icons
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

// Components
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

// Assets
import campaignsHeroImage from '@/assets/campaigns/campaignsHeroImage.png';

const HeroSection = () => {
    return (
        <section className="section-gap mt-16 lg:mt-20 bg-surface">
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
                            Explore verified campaigns, respond to urgent needs,
                            and{' '}
                            <span className="inline md:block">
                                stand with people when it matters most.
                            </span>
                        </>
                    }
                    descriptionSize="hero"
                    descriptionClass="max-w-3xl mx-auto"
                />

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-5">
                    <Button size="lg" className="w-full sm:w-auto">
                        <TbHeartFilled />
                        Browse Urgent Cases
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto"
                    >
                        Become a Volunteer
                        <HiArrowSmRight className="mt-0.5" />
                    </Button>
                </div>

                {/* Stats */}
                <div className="mt-10 lg:mt-12 flex flex-col md:flex-row justify-center gap-x-8 gap-y-3 text-center text-sm text-text-secondary">
                    <div>✓ Verified Requests</div>
                    <div>✓ Transparent Progress Tracking</div>
                    <div>✓ AI-Assisted Prioritization</div>
                </div>

                {/* Hero Image */}
                <div className="mt-12 xl:mt-16 overflow-hidden rounded-3xl lg:rounded-4xl">
                    <img
                        src={campaignsHeroImage}
                        alt="Campaigns Hero"
                        className="
                            w-full
                            h-75
                            sm:h-105
                            md:h-115
                            lg:h-140
                            xl:h-160
                            object-cover
                        "
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
