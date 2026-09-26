import React from 'react';

import Button from './Button';
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
}) => {
    return (
        <section className="relative overflow-hidden bg-surface mt-20">
            <div className="container-width">
                <div
                    className="
                        grid
                        grid-cols-1
                        items-center

                        gap-8
                        py-10

                        sm:gap-10
                        sm:py-14

                        /* =================================
                           LAPTOP — lg
                           Balanced two-column layout
                        ================================= */
                        lg:grid-cols-[0.95fr_1.05fr]
                        lg:gap-8
                        lg:py-14

                        /* =================================
                           DESKTOP — xl
                           More breathing room
                        ================================= */
                        xl:grid-cols-[0.95fr_1.05fr]
                        xl:gap-14
                        xl:py-20
                    "
                >
                    {/* =================================
                        CONTENT

                        Mobile:
                        - First

                        Laptop/Desktop:
                        - Left column
                        - Left aligned
                    ================================= */}
                    <div
                        className="
                            order-1
                            flex
                            min-w-0
                            flex-col
                            items-center
                            text-center

                            lg:order-1
                            lg:items-start
                            lg:text-left
                        "
                    >
                        <Motion variant="blurIn">
                            <SectionHeading
                                align="center"
                                headingTag="h1"
                                headingSize="hero"
                                badge={badge}
                                badgeIcon={badgeIcon}
                                badgeClass={badgeClass}
                                title={title}
                                headingClass="
                                    !capitalize-none
                                    !leading-[1.08]
                                    !tracking-[-0.025em]

                                    max-w-2xl

                                    lg:!text-left
                                "
                                description={description}
                                descriptionSize="hero"
                                descriptionClass="
                                    !mx-auto
                                    !mt-5
                                    !max-w-xl
                                    !leading-7

                                    lg:!mx-0
                                    lg:!text-left
                                "
                                wrapperClass="
                                    !items-center
                                    !text-center

                                    lg:!items-start
                                    lg:!text-left
                                "
                            />
                        </Motion>

                        {/* ACTIONS */}
                        {(primaryCta || secondaryCta) && (
                            <Motion variant="fadeUp">
                                <div
                                    className="
                                        mt-7
                                        flex
                                        w-full
                                        flex-col
                                        gap-3

                                        sm:w-auto
                                        sm:flex-row
                                        sm:items-center

                                        lg:mt-8
                                    "
                                >
                                    {primaryCta && (
                                        <Button
                                            size="lg"
                                            to={primaryCta.to}
                                            className="
                                                w-full
                                                !rounded-xl
                                                !px-6

                                                sm:w-auto
                                                lg:!px-5
                                                xl:!px-6
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
                                            variant="outline"
                                            size="lg"
                                            to={secondaryCta.to}
                                            className="
                                                group
                                                w-full
                                                !rounded-xl
                                                !border-border
                                                !bg-surface
                                                !px-6

                                                hover:!border-primary/30
                                                hover:!bg-background-alt

                                                sm:w-auto
                                                lg:!px-5
                                                xl:!px-6
                                            "
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                {secondaryCta.label}

                                                <span
                                                    className="
                                                        transition-transform
                                                        duration-200
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

                        {/* TRUST / IMPACT */}
                        {showStats && (
                            <Motion variant="fadeUp" className="mt-8 w-full">
                                <div
                                    className="
                                        xl:border-t
                                        border-border
                                        xl:pt-6
                                    "
                                >
                                    <HeroStats />
                                </div>
                            </Motion>
                        )}
                    </div>

                    {/* =================================
                        IMAGE

                        Mobile:
                        - Comes AFTER content

                        Laptop:
                        - Controlled image size

                        Desktop:
                        - Larger image
                    ================================= */}
                    <div
                        className="
                            order-2
                            min-w-0
                            w-full

                            lg:order-2
                        "
                    >
                        <Motion variant="scaleUp">
                            <div
                                className="
                                    relative
                                    mx-auto
                                    w-full

                                    lg:max-w-[540px]
                                    lg:ml-auto

                                    xl:max-w-[640px]
                                "
                            >
                                {/* IMAGE FRAME */}
                                <div
                                    className="
                                        relative
                                        overflow-hidden
                                        rounded-[1.5rem]
                                        border
                                        border-border
                                        bg-background-alt
                                        shadow-[0_20px_55px_rgba(15,23,42,0.10)]

                                        sm:rounded-[1.75rem]

                                        lg:rounded-[1.5rem]

                                        xl:rounded-[1.75rem]
                                    "
                                >
                                    <div
                                        className="
                                            aspect-[4/3]
                                            w-full

                                            sm:aspect-[5/4]

                                            lg:aspect-[4/3]

                                            xl:aspect-[5/4]
                                        "
                                    >
                                        <img
                                            src={image}
                                            alt={imageAlt}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                            "
                                            loading="eager"
                                        />
                                    </div>

                                    {/* SUBTLE IMAGE OVERLAY */}
                                    <div
                                        className="
                                            pointer-events-none
                                            absolute
                                            inset-0
                                            bg-gradient-to-t
                                            from-slate-950/20
                                            via-transparent
                                            to-transparent
                                        "
                                    />
                                </div>

                                {/* =================================
                                    IMPACT LABEL

                                    Smaller on laptop so it doesn't
                                    overpower the image.
                                ================================= */}
                                <div
                                    className="
                                        absolute
                                        bottom-4
                                        left-4
                                        max-w-[calc(100%-2rem)]
                                        rounded-xl
                                        border
                                        border-white/70
                                        bg-surface/95
                                        px-3
                                        py-2.5
                                        shadow-lg
                                        backdrop-blur-sm

                                        sm:bottom-5
                                        sm:left-5
                                        sm:px-4
                                        sm:py-3

                                        lg:bottom-4
                                        lg:left-4
                                        lg:px-3
                                        lg:py-2.5

                                        xl:bottom-6
                                        xl:left-6
                                        xl:px-4
                                        xl:py-3
                                    "
                                >
                                    <div className="flex items-center gap-2.5 sm:gap-3">
                                        <div
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-primary/10
                                                text-primary

                                                sm:h-9
                                                sm:w-9
                                            "
                                        >
                                            <span className="text-sm sm:text-base">
                                                ♥
                                            </span>
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    truncate
                                                    text-xs
                                                    font-semibold
                                                    text-text-primary

                                                    sm:text-sm
                                                "
                                            >
                                                মানুষের পাশে
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-[10px]
                                                    text-text-secondary

                                                    sm:text-xs
                                                "
                                            >
                                                সহায়তা পৌঁছে দিতে একসাথে
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* IMAGE CORNER ACCENT */}
                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        -right-1.5
                                        -top-1.5
                                        h-10
                                        w-10
                                        rounded-xl
                                        bg-primary/10

                                        sm:-right-2
                                        sm:-top-2
                                        sm:h-12
                                        sm:w-12

                                        xl:-right-3
                                        xl:-top-3
                                    "
                                />
                            </div>
                        </Motion>
                    </div>
                </div>
            </div>

            {/* BOTTOM TRANSITION */}
            <div className="h-px w-full bg-border" />
        </section>
    );
};

export default Hero;
