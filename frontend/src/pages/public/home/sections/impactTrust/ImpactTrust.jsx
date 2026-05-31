import React from 'react';

import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

import HumanProof from './HumanProof';
import ImpactSnapshot from '../hero/ImpactSnapshot';
import TrustProof from './TrustProof';
import TrustBanner from './TrustBanner';

const ImpactTrust = () => {
    return (
        <section className="section-gap">
            <div className="container-width">
                {/* Heading */}
                <Motion variant="fadeUp">
                    <SectionHeading
                        align="left"
                        badge={{
                            label: 'Trust & Accountability',
                            variant: 'primary',
                            tone: 'solid',
                            size: 'lg',
                        }}
                        title="Why People Trust CareLink"
                        description="Every request is verified, every contribution is traceable, and every impact is measurable."
                    />
                </Motion>

                {/* Human Proof */}
                <Motion variant="softLift">
                    <div className="mt-12">
                        <HumanProof />
                    </div>
                </Motion>

                {/* Middle grid (FULL responsive fix) */}
                <Motion variant="fadeUp">
                    <div className="mt-20 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <TrustProof />
                        <TrustBanner />
                    </div>
                </Motion>
            </div>
        </section>
    );
};

export default ImpactTrust;
