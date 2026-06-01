import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import StoriesPreview from './StoriesPreview';
import HumanProof from './HumanProof';
import FinalCTA from './FinalCTA';

const ImpactTrust = () => {
    return (
        <section className="section-gap">
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

                {/* 1. HUMAN PROOF (peak trust) */}
                <Motion variant="softLift">
                    <div className="mt-12">
                        <HumanProof />
                    </div>
                </Motion>

                {/* 2. SYSTEM ACTIVITY */}
                <Motion variant="softLift">
                    <StoriesPreview />
                </Motion>

                {/* 3. FINAL CTA (decision) */}
                <Motion variant="softLift">
                    <FinalCTA />
                </Motion>
            </div>
        </section>
    );
};

export default ImpactTrust;
