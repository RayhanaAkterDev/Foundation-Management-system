import React from 'react';
import Button from './Button';
import SectionHeading from './SectionHeading';
import HeroStats from '@/pages/public/home/sections/hero/HeroStats';

const Hero = ({
    badge,
    badgeIcon,
    badgeClass,

    title,
    description,

    primaryCta,
    secondaryCta,

    showStats,

    image,
    imageAlt = 'Hero image',
}) => {
    return (
        <section className="mt-18 bg-surface">
            <div className="container-width">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-6 section-gap">
                    {/* LEFT CONTENT */}
                    <div className="w-full lg:w-1/2 order-2 lg:order-1">
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
                            descriptionClass="max-w-xl!"
                            wrapperClass="lg:items-start lg:text-left"
                        />

                        {showStats && <HeroStats />}

                        {(primaryCta || secondaryCta) && (
                            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
                                {primaryCta && (
                                    <Button
                                        size="lg"
                                        to={primaryCta.to}
                                        className="w-full sm:w-auto"
                                    >
                                        <span className="flex items-center gap-2">
                                            {primaryCta.icon}
                                            {primaryCta.label}
                                        </span>
                                    </Button>
                                )}

                                {secondaryCta && (
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        to={secondaryCta.to}
                                        className="w-full sm:w-auto group"
                                    >
                                        <span className="flex items-center gap-2">
                                            {secondaryCta.label}
                                            {secondaryCta.icon}
                                        </span>
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative w-full lg:w-1/2 order-1 lg:order-2">
                        <div className="relative w-full aspect-4/3 lg:aspect-square overflow-hidden rounded-2xl shadow-lg">
                            <img
                                src={image}
                                alt={imageAlt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />

                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
