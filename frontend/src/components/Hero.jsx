import React from 'react';

import Button from './Button';
import SectionHeading from './SectionHeading';
// import UrgentRequestsCard from '@/pages/public/home/sections/hero/UrgentRequestsCard';
// import LiveImpactCard from '@/pages/public/home/sections/hero/LiveImpactCard';
import HeroStats from '@/pages/public/home/sections/hero/HeroStats';

const Hero = ({
    badge,
    badgeIcon,
    badgeClass,
    title,
    description,
    primaryCta,
    secondaryCta,
    image,
}) => {
    return (
        <section className="mt-24 bg-surface">
            <div className="container-width grid grid-cols-1 lg:grid-cols-2">
                {/* LEFT */}
                <div className="text-center lg:text-left section-gap">
                    <SectionHeading
                        align="center"
                        headingTag="h1"
                        headingSize="hero"
                        badge={badge}
                        badgeIcon={badgeIcon}
                        badgeClass={badgeClass}
                        title={title}
                        headingClass="capitalize"
                        description={description}
                        descriptionSize="hero"
                        descriptionClass="w-sm lg:w-full"
                        wrapperClass="lg:items-start lg:text-left"
                    />

                    <HeroStats />

                    <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-10 justify-center lg:justify-start">
                        {primaryCta && (
                            <Button size="lg" className="w-full sm:w-auto">
                                {primaryCta.label}
                            </Button>
                        )}
                        {secondaryCta && (
                            <Button
                                variant="ghost"
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                {secondaryCta.label}
                            </Button>
                        )}
                    </div>
                </div>

                {/* RIGHT - CANVAS */}
                <div className="relative">
                    <img
                        src={image}
                        alt="bd map"
                        className="w-full max-w-175 h-auto object-contain"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
