import React from 'react';
import { TbHeartFilled } from 'react-icons/tb';
import { HiArrowSmRight } from 'react-icons/hi';

import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import campaignsHeroImage from '@/assets/campaigns/campaignsHeroImage.png';

const HeroSection = () => {
    const handleScroll = () => {
        document.getElementById('explore')?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    return (
        <section className="bg-surface">
            <div className="container-width section-gap mt-24">
                {/* TEXT BLOCK */}
                <SectionHeading
                    badge={{
                        label: 'All Campaigns',
                        variant: 'accent',
                        tone: 'soft',
                        size: 'md',
                    }}
                    title={
                        <>
                            Support real people{' '}
                            <span className="text-primary sm:block">
                                when it matters most
                            </span>
                        </>
                    }
                    headingSize="hero"
                    description={
                        <>
                            Browse verified campaigns and contribute to urgent
                            needs across communities.
                        </>
                    }
                    descriptionClass="max-w-2xl"
                />

                {/* CTA */}
                <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        size="lg"
                        to="/volunteer"
                        variant="accent"
                        className="w-full sm:w-auto"
                    >
                        Become a Volunteer
                    </Button>

                    <Button
                        size="lg"
                        variant="ghost"
                        onClick={handleScroll}
                        className=""
                    >
                        Explore Campaigns
                        <HiArrowSmRight className="mt-0.75" />
                    </Button>
                </div>

                {/* IMAGE (reduced importance) */}
                <div className="mt-16 overflow-hidden rounded-3xl">
                    <img
                        src={campaignsHeroImage}
                        alt="Campaigns Hero"
                        className="
                            w-full
                            h-56 sm:h-72 md:h-80 lg:h-136
                            object-cover
                        "
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
