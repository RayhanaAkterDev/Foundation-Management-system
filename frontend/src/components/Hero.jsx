import React from 'react';

// Reusable UI components
import Button from './Button';
import SectionHeading from './SectionHeading';
import UrgentRequestsCard from '@/pages/public/home/sections/hero/UrgentRequestsCard';
import LiveImpactCard from '@/pages/public/home/sections/hero/LiveImpactCard';
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
    bgClass = 'bg-[#FCFBFD]',
}) => {
    return (
        <section
            className={`mt-24 bg-cover bg-right relative ${bgClass}`}
            style={{ backgroundImage: `url(${image})` }}
        >
            {/* OVERLAY */}
            <div className="absolute z-0 inset-0 bg-white/30" />

            {/* MAIN CONTENT */}
            <div className="relative z-10 container-width">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* LEFT CONTENT */}
                    <div className="text-center sm:text-left py-16 lg:py-24 xl:pl-16">
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
                            wrapperClass="sm:items-start sm:text-left"
                        />

                        {/* Stats */}
                        <HeroStats />

                        {/* CTA */}
                        <div
                            className="
                            flex
                                flex-col
                                sm:flex-row
                                gap-4
                                mt-6
                                lg:mt-10
                                justify-center
                                sm:justify-start
                            "
                        >
                            {primaryCta && (
                                <Button className="w-full sm:w-auto">
                                    {primaryCta.label}
                                    {primaryCta.icon && (
                                        <span className="mr-2">
                                            {primaryCta.icon}
                                        </span>
                                    )}
                                </Button>
                            )}

                            {secondaryCta && (
                                <Button
                                    variant="ghost"
                                    className="
                                        w-full
                                        sm:w-auto
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                    "
                                >
                                    {secondaryCta.label}

                                    {secondaryCta.icon && (
                                        <span className="inline-flex mt-0.5">
                                            {secondaryCta.icon}
                                        </span>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* RIGHT CONTENT */}
                    <div>
                        <UrgentRequestsCard />
                        <LiveImpactCard />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
