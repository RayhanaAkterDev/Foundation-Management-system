import React from 'react';

// Reusable UI components
import Button from './Button';
import SectionHeading from './SectionHeading';

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
            className={`mt-24 bg-cover bg-center relative ${bgClass}`}
            style={{ backgroundImage: `url(${image})` }}
        >
            {/* OVERLAY */}
            <div className="absolute z-0 inset-0 bg-white/30" />

            {/* MAIN CONTENT */}
            <div className="relative z-10 container-width py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                    {/* LEFT CONTENT */}
                    <div className="text-center sm:text-left">
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
                    </div>

                    {/* EMPTY RIGHT COLUMN FOR DESKTOP BALANCE */}
                    <div className="hidden lg:block" />
                </div>
            </div>
        </section>
    );
};

export default Hero;
