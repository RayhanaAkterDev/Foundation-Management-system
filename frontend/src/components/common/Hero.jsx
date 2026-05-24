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
    imageWidth = '50%',
    showStats = false,

    bgClass = 'bg-[#FCFBFD]',
}) => {
    return (
        <section className={`section-gap relative overflow-hidden ${bgClass}`}>
            {/* TEXT CONTAINER */}
            <div className="container-width relative z-10">
                {/* LEFT: TEXT */}
                <div className="w-1/2">
                    <SectionHeading
                        align="left"
                        headingTag="h1"
                        headingSize="hero"
                        badge={badge}
                        badgeIcon={badgeIcon}
                        badgeClass={badgeClass}
                        title={title}
                        description={description}
                        descriptionSize="hero"
                    />

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 my-8">
                        {primaryCta && (
                            <Button className="w-full sm:w-auto">
                                {primaryCta.icon}
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
                                    <span className="mt-0.5 inline-flex">
                                        {secondaryCta.icon}
                                    </span>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* stats */}
                    {showStats && (
                        <StatCard
                            variant="row"
                            size="md"
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
                    )}
                </div>
            </div>

            {/* OUTSIDE IMAGE */}
            {image && (
                <div
                    className="absolute right-0 top-0 hidden lg:block"
                    style={{ width: imageWidth }}
                >
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
