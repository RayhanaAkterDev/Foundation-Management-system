import React from 'react';
import Motion from '@/components/motion/Motion';
import SectionHeading from '@/components/SectionHeading';

const steps = [
    'Need Submitted',
    'AI Understanding',
    'Verification Layer',
    'Priority Engine',
    'Smart Matching',
    'Human Delivery',
];

const SystemOverview = () => {
    return (
        <section className="bg-primary section-gap overflow-hidden">
            <div className="container-width">
                <Motion className="max-w-3xl">
                    <SectionHeading
                        align="left"
                        title="A continuous system turning human needs into verified action"
                        headingSize="sectionHero"
                        headingClass="text-surface"
                        description="Stand For People is not a form system — it is an AI-driven coordination layer that understands, verifies, prioritizes, and connects real-world support."
                        descriptionSize="hero"
                        descriptionClass="text-surface/80!"
                    />
                </Motion>

                {/* Desktop */}
                <div className="hidden lg:block mt-20">
                    <div className="relative">
                        <div
                            className="
                            absolute
                            left-0
                            right-0
                            top-6

                            h-px

                            bg-surface/20
                        "
                        />

                        <div className="grid grid-cols-6 gap-6 relative">
                            {steps.map((step, index) => (
                                <Motion key={step}>
                                    <div className="text-center">
                                        <div
                                            className="
                                            w-12
                                            h-12

                                            rounded-full

                                            bg-surface
                                            text-primary

                                            mx-auto

                                            flex
                                            items-center
                                            justify-center

                                            font-semibold
                                            text-sm

                                            relative
                                            z-10
                                        "
                                        >
                                            {String(index + 1).padStart(2, '0')}
                                        </div>

                                        <p
                                            className="
                                            mt-5

                                            text-sm
                                            xl:text-base

                                            font-medium

                                            text-surface

                                            leading-relaxed
                                        "
                                        >
                                            {step}
                                        </p>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile + Tablet */}
                <div className="lg:hidden mt-14">
                    <div className="relative">
                        {/* continuous timeline spine */}
                        <div className="absolute left-5 top-2 bottom-2 w-px bg-surface/25" />

                        <div className="space-y-6 sm:space-y-7">
                            {steps.map((step, index) => (
                                <Motion key={step}>
                                    <div className="flex gap-4 sm:gap-5 items-start">
                                        {/* node */}
                                        <div className="relative flex flex-col items-center z-10">
                                            <div
                                                className="
                                    w-10 h-10 sm:w-11 sm:h-11

                                    rounded-full

                                    bg-surface
                                    text-primary

                                    flex items-center justify-center

                                    font-semibold
                                    text-xs sm:text-sm

                                    shadow-sm
                                "
                                            >
                                                {String(index + 1).padStart(
                                                    2,
                                                    '0',
                                                )}
                                            </div>

                                            {/* connector continuation (only if not last) */}
                                            {index !== steps.length - 1 && (
                                                <div className="w-px flex-1 min-h-10 bg-surface/25" />
                                            )}
                                        </div>

                                        {/* content */}
                                        <div className="pt-1 sm:pt-2">
                                            <p className="text-surface font-medium text-base sm:text-lg leading-snug">
                                                {step}
                                            </p>

                                            {/* subtle step hint (optional but improves clarity) */}
                                            <p className="text-surface/60 text-xs sm:text-sm mt-1">
                                                Step {index + 1} of{' '}
                                                {steps.length}
                                            </p>
                                        </div>
                                    </div>
                                </Motion>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SystemOverview;
