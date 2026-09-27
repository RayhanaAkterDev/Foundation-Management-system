import React from 'react';

import Button from './Button';
import HeroStats from '@/pages/public/home/sections/hero/HeroStats';
import Motion from './motion/Motion';

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
        <section className="relative mt-20 overflow-hidden bg-surface">
            <div className="container-width">
                <div
                    className="
                        grid grid-cols-1
                        pb-14 pt-8
                        sm:pb-16 sm:pt-10

                        lg:grid-cols-12 lg:items-center lg:gap-x-8
                        lg:min-h-[610px] lg:py-12

                        xl:min-h-[700px] xl:gap-x-12 xl:py-16
                    "
                >
                    {/* EDITORIAL COPY */}
                    <div
                        className="
                            relative z-10
                            lg:col-span-5 lg:pr-2
                            xl:col-span-5 xl:pr-8
                        "
                    >
                        {(badge || badgeIcon) && (
                            <Motion variant="fadeUp">
                                <div
                                    className={`
                                        mb-5 flex items-center gap-3
                                        font-nav text-[11px] font-medium uppercase
                                        tracking-[0.14em] text-primary
                                        sm:mb-6 sm:text-xs
                                        lg:mb-5
                                        xl:mb-7
                                        ${badgeClass || ''}
                                    `}
                                >
                                    {badgeIcon && (
                                        <span className="flex shrink-0 items-center text-primary">
                                            {badgeIcon}
                                        </span>
                                    )}
                                    {badge && <span>{badge}</span>}
                                </div>
                            </Motion>
                        )}

                        <Motion variant="blurIn">
                            <h1
                                className="
                                    max-w-[15ch]
                                    font-display font-medium
                                    text-[2.35rem] leading-[1.13] tracking-[-0.02em]
                                    text-text-primary

                                    sm:max-w-[14ch] sm:text-[2.75rem] sm:leading-[1.12]

                                    lg:max-w-[12.5ch] lg:text-[3rem] lg:leading-[1.1]

                                    xl:max-w-[13.5ch] xl:text-[3.45rem] xl:leading-[1.08]
                                "
                            >
                                {title}
                            </h1>
                        </Motion>

                        {description && (
                            <Motion variant="fadeUp">
                                <p
                                    className="
                                        mt-5 max-w-[37rem]
                                        text-[15px] leading-[1.8] text-text-body

                                        sm:mt-6 sm:text-base sm:leading-[1.85]

                                        lg:mt-6 lg:max-w-[29rem] lg:text-[15px] lg:leading-[1.8]

                                        xl:mt-7 xl:max-w-[32rem] xl:text-base
                                    "
                                >
                                    {description}
                                </p>
                            </Motion>
                        )}

                        {(primaryCta || secondaryCta) && (
                            <Motion variant="fadeUp">
                                <div
                                    className="
                                        mt-7 flex flex-col items-stretch gap-3
                                        sm:flex-row sm:items-center sm:gap-6
                                        lg:mt-8 lg:gap-5
                                        xl:mt-9 xl:gap-7
                                    "
                                >
                                    {primaryCta && (
                                        <Button
                                            size="lg"
                                            to={primaryCta.to}
                                            className="
                                                w-full !min-h-12 !rounded-md !px-7
                                                sm:w-auto
                                                lg:!min-h-11 lg:!px-6
                                                xl:!min-h-12 xl:!px-7
                                            "
                                        >
                                            <span className="flex items-center justify-center gap-2">
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
                                            className="
                                                group w-full !min-h-11 !justify-center !rounded-none
                                                !px-0 !text-text-primary
                                                hover:!bg-transparent hover:!text-primary
                                                sm:w-auto sm:!justify-start
                                            "
                                        >
                                            <span className="flex items-center justify-center gap-2.5">
                                                {secondaryCta.label}
                                                <span
                                                    className="
                                                        text-primary transition-transform duration-200
                                                        group-hover:translate-x-1
                                                    "
                                                >
                                                    {secondaryCta.icon}
                                                </span>
                                            </span>
                                        </Button>
                                    )}
                                </div>
                            </Motion>
                        )}
                    </div>

                    {/* PHOTOGRAPHIC FIELD */}
                    <div
                        className="
                            mt-9 min-w-0
                            sm:mt-11

                            lg:col-span-7 lg:mt-0
                            lg:-mr-8 lg:pl-1

                            xl:-mr-16 xl:pl-4
                        "
                    >
                        <Motion variant="fadeIn">
                            <figure
                                className="
                                    relative w-full overflow-hidden bg-background-alt
                                    rounded-[0.75rem]

                                    lg:rounded-[0.5rem]
                                    xl:rounded-[0.625rem]
                                "
                            >
                                <div
                                    className="
                                        aspect-[5/4] w-full
                                        sm:aspect-[16/10]
                                        lg:aspect-[1.28/1]
                                        xl:aspect-[1.48/1]
                                    "
                                >
                                    <img
                                        src={image}
                                        alt={imageAlt}
                                        className="h-full w-full object-cover object-center"
                                        loading="eager"
                                    />
                                </div>
                            </figure>
                        </Motion>
                    </div>

                    {/* XL TRUST RAIL */}
                    {showStats && (
                        <div
                            className="
                                hidden
                                xl:col-span-12 xl:mt-9 xl:block
                            "
                        >
                            <Motion variant="fadeUp">
                                <div className="border-t border-border pt-1">
                                    <HeroStats />
                                </div>
                            </Motion>
                        </div>
                    )}
                </div>
            </div>

            <div className="container-width" aria-hidden="true">
                <div className="h-px bg-border/70" />
            </div>
        </section>
    );
};

export default Hero;
