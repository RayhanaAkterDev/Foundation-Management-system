import React from 'react';
import Motion from '@/components/motion/Motion';
import SectionHeading from '@/components/SectionHeading';
import trustSystem from '@/assets/howItWorksPage/trustSystem.png';

const steps = [
    'Understanding Needs',
    'Verification & Trust',
    'Priority Assessment',
    'Support Delivery',
];

const SystemOverview = () => {
    return (
        <section className="bg-primary section-gap overflow-hidden">
            <div className="container-width px-4">
                <Motion variant="fadeUp">
                    <SectionHeading
                        align="center"
                        title="How It Works"
                        headingSize="sectionHero"
                        headingClass="text-surface"
                        description="Every request follows a transparent journey—from understanding real needs to delivering support through trusted people and coordinated action."
                        descriptionSize="hero"
                        descriptionClass="text-surface/80!"
                    />
                </Motion>

                <div className='flex flex-col items-center'>
                    <div className="relative mt-16 lg:mt-20 max-w-7xl mx-auto order-2 lg:order-1">
                        {/* Timeline */}
                        <div
                            className="
                            absolute
                            left-7
                            top-0
                            bottom-0
                            w-px
                            bg-surface/10

                            md:left-12
                            md:right-12
                            md:top-7
                            md:bottom-auto
                            md:h-px
                            md:w-auto

                            lg:left-6
                            lg:right-6
                            lg:top-8
                        "
                        />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-14 md:gap-5 lg:gap-8">
                            {steps.map((step, index) => (
                                <Motion key={step}>
                                    <div
                                        className="
                                        relative
                                        flex
                                        items-center
                                        gap-5

                                        md:flex-col
                                        md:items-center
                                        md:text-center
                                    "
                                    >
                                        {/* Timeline Node */}
                                        <div className="relative z-10 shrink-0">
                                            <div
                                                className="
                                                flex
                                                items-center
                                                justify-center

                                                w-14
                                                h-14

                                                lg:w-16
                                                lg:h-16

                                                rounded-full
                                                border
                                                border-surface/15
                                                bg-surface
                                                shadow-lg
                                            "
                                            >
                                                <span className="font-bold text-primary text-sm lg:text-base">
                                                    {String(index + 1).padStart(
                                                        2,
                                                        '0',
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="md:max-w-37.5 lg:max-w-45">
                                            <p className="text-[11px] uppercase tracking-[0.25em] text-surface/40">
                                                Stage
                                            </p>

                                            <h3 className="mt-3 text-base lg:text-lg font-semibold leading-snug text-surface">
                                                {step}
                                            </h3>
                                        </div>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    </div>

                    <div className="pt-12 lg:pt-16 order-1 lg:order-2">
                        <img
                            src={trustSystem}
                            className="w-full h-auto rounded-4xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystemOverview;
