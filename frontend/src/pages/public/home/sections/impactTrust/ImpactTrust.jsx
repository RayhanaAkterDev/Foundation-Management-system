import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import StoriesPreview from './StoriesPreview';
import HumanProof from './HumanProof';
import FinalCTA from './FinalCTA';

const ImpactTrust = () => {
    return (
        <section className="section-gap border-t border-border">
            <div className="container-width">
                {/* Heading */}
                <Motion variant="fadeUp">
                    <SectionHeading
                        align="left"
                        badge={{
                            label: 'Transparency & Trust',
                            variant: 'primary',
                            tone: 'solid',
                            size: 'lg',
                        }}
                        title={
                            <>
                                Every impact is real.
                                <span className="block text-primary pt-1">
                                    Every action is verified.
                                </span>
                            </>
                        }
                        headingSize="sectionHero"
                        description="Support reaches people through verified requests across real situations."
                        descriptionSize="sectionHero"
                    />
                </Motion>

                {/* CONTENT STACK (controlled spacing system) */}
                <div className="mt-8 sm:mt-12 space-y-10 sm:space-y-12">
                    {/* 1. HUMAN PROOF */}
                    <Motion variant="softLift">
                        <HumanProof />
                    </Motion>

                    {/* 2. SYSTEM ACTIVITY */}
                    <Motion variant="softLift">
                        <StoriesPreview />
                    </Motion>

                    {/* 3. FINAL CTA */}
                    <Motion variant="softLift">
                        <FinalCTA />
                    </Motion>
                </div>
            </div>
        </section>
    );
};

export default ImpactTrust;
