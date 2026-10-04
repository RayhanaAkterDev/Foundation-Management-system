import React from 'react';

import { ArrowRight, HeartHandshake } from 'lucide-react';

import Button from './Button';
import Badge from './Badge';
import SectionHeading from './SectionHeading';
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
    lang,
}) => {
    return (
        <section
            className="
                relative
                mt-20
                overflow-hidden
                bg-surface
            "
            lang={lang}
        >
            <div className="container-width">
                {/* ─────────────────────────────────────────
                    INTRO
                ───────────────────────────────────────── */}
                <div
                    className="
                        pb-8
                        pt-12

                        sm:pb-10
                        sm:pt-16

                        lg:pb-12
                        lg:pt-20

                        xl:pb-14
                        xl:pt-24
                    "
                >
                    <div
                        className="
                            max-w-[68rem]
                            lg:max-w-[76rem]
                            xl:max-w-[82rem]
                        "
                    >
                        {(badge || badgeIcon) && (
                            <Motion variant="fadeUp">
                                <div
                                    className="
                                        mb-5
                                        flex
                                        items-center
                                        gap-2.5

                                        sm:mb-6

                                        lg:mb-7
                                    "
                                >
                                    <span className="h-2 w-2 shrink-0 rounded-full bg-primary/80" />

                                    <Badge
                                        variant="primary"
                                        tone="soft"
                                        size="md"
                                        shape="label"
                                        className={`
                                            !rounded-full
                                            !bg-transparent
                                            !px-0
                                            !py-0
                                            text-sm
                                            font-medium!
                                            text-primary
                                            sm:text-[15px]
                                            ${badgeClass || ''}
                                        `}
                                    >
                                        {badge}
                                    </Badge>
                                </div>
                            </Motion>
                        )}

                        <Motion variant="blurIn">
                            <SectionHeading
                                lang={lang}
                                title={title}
                                headingTag="h1"
                                align="left"
                                gap="none"
                                headingSize="hero"
                                treatment="editorial"
                                wrapperClass="max-w-none"
                                headingClass="
    max-w-[16ch]

    !text-[3rem]
    !leading-[1.28]
    !tracking-[-0.012em]

    sm:!text-[3.75rem]
    sm:!leading-[1.25]
    sm:!tracking-[-0.014em]

    lg:!text-[4.5rem]
    lg:!leading-[1.22]
    lg:!tracking-[-0.016em]

    xl:!text-[5.25rem]
    xl:!leading-[1.2]
    xl:!tracking-[-0.018em]
"
                                description={null}
                            />
                        </Motion>

                        <div
                            className="
    mt-9
    flex
    flex-col
    gap-8

    sm:mt-10

    lg:mt-12
    lg:flex-row
    lg:items-end
    lg:justify-between
    lg:gap-14

    xl:mt-14
    xl:gap-20
"
                        >
                            {description && (
                                <Motion variant="fadeUp">
                                    <p
                                        className="
                                            max-w-[42rem]
                                            text-[16px]
                                            leading-[1.78]
                                            text-text-body

                                            sm:text-[17px]

                                            lg:max-w-[43rem]
                                            lg:text-[17px]

                                            xl:max-w-[47rem]
                                            xl:text-[18px]
                                            xl:leading-[1.75]
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
                                            flex
                                            shrink-0
                                            flex-col
                                            gap-3

                                            sm:flex-row
                                            sm:items-center
                                            sm:gap-5

                                            lg:pb-0.5
                                        "
                                    >
                                        {primaryCta && (
                                            <Button
                                                size="lg"
                                                to={primaryCta.to}
                                                className="
                                                    w-full
                                                    !min-h-[52px]
                                                    !justify-center
                                                    !rounded-[0.65rem]
                                                    !px-7
                                                    !text-[15px]

                                                    sm:w-auto

                                                    lg:!min-h-[54px]
                                                    lg:!px-8
                                                    lg:!text-base
                                                "
                                            >
                                                {primaryCta.label}

                                                {primaryCta.icon || (
                                                    <ArrowRight className="h-4 w-4" />
                                                )}
                                            </Button>
                                        )}

                                        {secondaryCta && (
                                            <Button
                                                variant="editorial"
                                                size="lg"
                                                to={secondaryCta.to}
                                                className="
                                                    group
                                                    w-full
                                                    !min-h-[48px]
                                                    !justify-center
                                                    !px-2
                                                    !text-[15px]

                                                    sm:w-auto

                                                    lg:!text-base
                                                "
                                            >
                                                {secondaryCta.label}

                                                <span
                                                    className="
                                                        text-primary
                                                        transition-transform
                                                        duration-200
                                                        group-hover:translate-x-1
                                                    "
                                                >
                                                    {secondaryCta.icon || (
                                                        <ArrowRight className="h-4 w-4" />
                                                    )}
                                                </span>
                                            </Button>
                                        )}
                                    </div>
                                </Motion>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────
                    IMAGE
                ───────────────────────────────────────── */}
                <Motion variant="fadeIn">
                    <figure
                        className="
                            relative
                            overflow-hidden
                            rounded-[1.25rem]
                            bg-background-alt

                            sm:rounded-[1.5rem]

                            lg:rounded-[1.75rem]
                        "
                    >
                        <div
                            className="
                                absolute
                                inset-0
                                z-10
                                rounded-[inherit]
                                ring-1
                                ring-inset
                                ring-black/[0.07]
                            "
                        />

                        <div
                            className="
                                aspect-[4/3]
                                w-full

                                sm:aspect-[16/9]

                                lg:h-[530px]
                                lg:aspect-auto

                                xl:h-[610px]
                            "
                        >
                            <img
                                src={image}
                                alt={imageAlt}
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                    object-center
                                "
                                loading="eager"
                            />
                        </div>
                    </figure>
                </Motion>
            </div>

            {/* ─────────────────────────────────────────
                TRUST / STATS
            ───────────────────────────────────────── */}
            {showStats && (
                <Motion variant="fadeUp">
                    <HeroStats />
                </Motion>
            )}
        </section>
    );
};

export default Hero;
