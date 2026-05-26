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
    return (
        <section
            className={`relative overflow-hidden mt-24 pt-16 lg:py-24 ${bgClass}`}
        >
            {/* TEXT BLOCK */}
            <div className="relative z-10">
                <div className="container-width">
                    {/* CONTENT WIDTH CONTROL */}
                    <div className="content-width">
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
                        <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 lg:mt-10 justify-center lg:justify-start">
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
                                    className="w-full sm:w-auto flex items-center gap-2"
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

                        {/* STATS */}
                        {showStats && (
                            <div className="mt-8">
                                <StatCard
                                    variant="row"
                                    size="sm"
                                    stats={[
                                        {
                                            icon: TbUsersGroup,
                                            value: '25K+',
                                            label: 'Lives Impacted',
                                        },
                                        {
                                            icon: TbHeartHandshake,
                                            value: '8K+',
                                            label: 'Volunteers',
                                            featured: true,
                                        },
                                        {
                                            icon: TbBuildingCommunity,
                                            value: '120+',
                                            label: 'Communities',
                                        },
                                    ]}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MOBILE IMAGE */}
            {image && (
                <div className="block lg:hidden mt-14 w-full">
                    <img
                        src={image}
                        alt="hero illustration"
                        className="w-full h-auto object-cover"
                    />
                </div>
            )}

            {/* DESKTOP IMAGE */}
            {image && (
                <div className="absolute right-0 top-0 hidden lg:block w-4/6">
                    <img
                        src={image}
                        alt="hero illustration"
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
        </section>
    );
};

export default Hero;