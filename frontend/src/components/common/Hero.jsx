import React from 'react';
import Button from '../common/Button';
import StatCard from '../common/StatCard';
import SectionHeading from '../common/SectionHeading';

import {
    TbUsersGroup,
    TbHeartHandshake,
    TbBuildingCommunity,
} from 'react-icons/tb';

const Hero = ({
    badge,
    badgeIcon,
    badgeClass,
    title,
    description,
    primaryCta,
    secondaryCta,
    image,
    showStats = false,
    bgClass = 'bg-[#FCFBFD]',
}) => {
    const stats = [
        {
            icon: TbUsersGroup,
            value: '25K+',
            label: 'People Supported',
        },
        {
            icon: TbHeartHandshake,
            value: '8K+',
            label: 'Active Volunteers',
            featured: true,
        },
        {
            icon: TbBuildingCommunity,
            value: '120+',
            label: 'Communities Reached',
        },
    ];

    return (
        <section className={`relative overflow-hidden mt-20 ${bgClass}`}>
            {/* DESKTOP IMAGE */}
            {image && (
                <div
                    className="
                        hidden lg:flex
                        items-center
                        absolute
                        inset-y-0
                        right-0
                        w-[48vw]
                        xl:w-[52vw]
                        2xl:w-[56vw]
                        z-0
                        pointer-events-none
                    "
                >
                    <img
                        src={image}
                        alt="hero illustration"
                        className="
                            w-full
                            h-auto
                            object-contain
                            object-right
                            lg:translate-x-6
                            xl:translate-x-10
                        "
                    />
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="relative z-10 container-width py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                    {/* LEFT CONTENT */}
                    <div className="text-center lg:text-left">
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
                            wrapperClass="lg:items-start lg:text-left"
                        />

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
                                lg:justify-start
                            "
                        >
                            {primaryCta && (
                                <Button className="w-full sm:w-auto">
                                    {primaryCta.icon && (
                                        <span className="mr-2">
                                            {primaryCta.icon}
                                        </span>
                                    )}

                                    {primaryCta.label}
                                </Button>
                            )}

                            {secondaryCta && (
                                <Button
                                    variant="outline"
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

                        {/* DESKTOP STATS */}
                        {showStats && (
                            <div className="hidden lg:block mt-10">
                                <StatCard
                                    variant="row"
                                    size="sm"
                                    stats={stats}
                                />
                            </div>
                        )}
                    </div>

                    {/* EMPTY RIGHT COLUMN FOR DESKTOP BALANCE */}
                    <div className="hidden lg:block" />
                </div>

                {/* MOBILE IMAGE + STATS FLOW */}
                <div className="lg:hidden mt-12 space-y-8">
                    {image && (
                        <div className="w-full">
                            <img
                                src={image}
                                alt="hero illustration"
                                className="
                                    w-full
                                    h-auto
                                    object-contain
                                "
                            />
                        </div>
                    )}

                    {showStats && (
                        <StatCard variant="row" size="sm" stats={stats} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
