// sections/Hero.jsx
import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import { TbArrowNarrowDown } from 'react-icons/tb';

const Hero = () => {
    return (
        <section className="section-gap mt-18">
            <div className="container-width text-center">
                <SectionHeading
                    title="Turning urgent needs into verified support"
                    headingSize="hero"
                    description="Stand For People is a structured coordination system that connects real-world needs with verified donors and volunteers using AI-assisted validation and transparent workflows."
                    descriptionSize="hero"
                />

                {/* TRUST CHIPS (refined hierarchy) */}
                <Motion className="mt-10 flex flex-wrap justify-center gap-3">
                    <span className="px-4 py-2 text-sm rounded-full bg-primary/5 border border-primary/10">
                        Verified Request System
                    </span>

                    <span className="px-4 py-2 text-sm rounded-full bg-primary/5 border border-primary/10">
                        AI + Human Validation
                    </span>

                    <span className="px-4 py-2 text-sm rounded-full bg-primary/5 border border-primary/10">
                        Transparent Tracking
                    </span>
                </Motion>

                {/* SYSTEM PREVIEW STRIP (NEW — IMPORTANT) */}
                <Motion variant="fadeUp" className="mt-12 mx-auto max-w-4xl">
                    <div className="rounded-2xl border border-border bg-surface/40 p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-text-secondary">
                            <span>Need → Intake → Verification → Delivery</span>

                            <span className="hidden md:block text-primary/30">
                                |
                            </span>

                            <span>Structured • Transparent • Traceable</span>
                        </div>
                    </div>
                </Motion>

                {/* SCROLL INDICATOR */}
                <Motion className="mt-10 flex justify-center">
                    <div className="flex flex-col items-center gap-2 text-primary/40 text-sm">
                        <TbArrowNarrowDown
                            size={18}
                            className="animate-bounce"
                        />
                        <span>Scroll to understand the system</span>
                    </div>
                </Motion>
            </div>
        </section>
    );
};

export default Hero;
