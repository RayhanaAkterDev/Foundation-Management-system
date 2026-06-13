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
    image,
    rightContent, // 👈 scalable slot instead of hardcoding cards
}) => {
    return (
        <section className="mt-24 bg-surface">
            <div className="container-width">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center lg:items-start gap-12">

                    {/* LEFT CONTENT */}
                    <div className="order-2 lg:order-1">
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
                            descriptionClass="max-w-md!"
                            wrapperClass="lg:items-start lg:text-left"
                        />

                        <HeroStats />

                        {/* CTA */}
                        {(primaryCta || secondaryCta) && (
                            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mt-8">
                                {primaryCta && (
                                    <Button
                                        size="lg"
                                        className="w-full sm:w-auto"
                                        onClick={primaryCta.onClick}
                                    >
                                        {primaryCta.label}
                                    </Button>
                                )}

                                {secondaryCta && (
                                    <Button
                                        variant="ghost"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                        onClick={secondaryCta.onClick}
                                    >
                                        {secondaryCta.label}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT VISUAL */}
                    <div className="relative order-1 lg:order-2">
                        <div className="relative w-full aspect-4/3 lg:aspect-square overflow-hidden rounded-2xl">
                            <img
                                src={image}
                                alt="Hero visual"
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />

                            {/* dark overlay for better readability */}
                            <div className="absolute inset-0 bg-black/10" />
                        </div>

                        {/* FLEXIBLE OVERLAY CONTENT */}
                        {rightContent && (
                            <div className="absolute inset-0 pointer-events-none">
                                {rightContent}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;