import React from 'react';
import { TbArrowNarrowDown } from 'react-icons/tb';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

const chips = [
    'Verified Intake',
    'AI + Human Review',
    'Priority Routing',
    'Transparent Tracking',
];

const flowSteps = ['Need', 'Intake', 'Verification', 'Priority', 'Delivery'];

/* shared styles */
const chipClass =
    'px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-full bg-primary/5 border border-primary/10 text-text-primary';

const separatorClass = 'text-text-secondary';

const HowItWorksPageHero = () => {
    return (
        <section className="section-gap mt-24 bg-surface">
            <div className="container-width">
                {/* HERO */}
                <SectionHeading
                    gap="lg"
                    title="Turning urgent needs into verified support"
                    headingSize="hero"
                    description="Stand For People is a structured coordination system that connects real-world needs with verified donors and volunteers using AI-assisted validation and transparent workflows."
                    descriptionSize="hero"
                />

                {/* CHIPS */}
                <Motion
                    variant="fadeUp"
                    className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3"
                >
                    {chips.map((chip) => (
                        <span key={chip} className={chipClass}>
                            {chip}
                        </span>
                    ))}
                </Motion>

                {/* FLOW STRIP */}
                <Motion variant="fadeUp" className="mt-12 mx-auto max-w-5xl">
                    <div className="relative overflow-hidden rounded-2xl border border-border bg-primary/5 px-6 py-6 sm:px-10 sm:py-8">
                        {/* background glow */}
                        <div className="absolute inset-0 opacity-40 bg-linear-to-r from-transparent via-primary/10 to-transparent" />

                        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-sm">
                            {/* FLOW */}
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 text-text-primary font-medium">
                                {flowSteps.map((step, index) => (
                                    <React.Fragment key={step}>
                                        <span>{step}</span>

                                        {index !== flowSteps.length - 1 && (
                                            <span className={separatorClass}>
                                                →
                                            </span>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            {/* TAGLINE */}
                            <div className="text-xs sm:text-sm text-primary">
                                Structured • Traceable • Human-Verified
                            </div>
                        </div>
                    </div>
                </Motion>

                {/* SCROLL */}
                <Motion className="mt-10 flex justify-center">
                    <div className="flex flex-col items-center gap-2 text-text-secondary text-sm tracking-wider">
                        <TbArrowNarrowDown
                            size={18}
                            className="animate-bounce text-primary"
                        />

                        <span className="text-xs sm:text-sm">
                            Scroll to explore the system
                        </span>
                    </div>
                </Motion>
            </div>
        </section>
    );
};

export default HowItWorksPageHero;
