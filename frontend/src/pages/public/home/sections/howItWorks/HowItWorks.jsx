import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import FlowGrid from './WorkflowGrid';
import FlowCTA from './WorkflowLink';

const HowCareLinkWorks = () => {
    return (
        <section className="section-gap">
            <div className="container-width">
                <SectionHeading
                    gap="lg"
                    badge={{
                        label: 'How Stand For People Works',
                        variant: 'primary',
                        tone: 'solid',
                        size: 'lg',
                    }}
                    title="From urgent need to verified support"
                    headingSize="sectionHero"
                />

                <FlowGrid />
                <FlowCTA />
            </div>
        </section>
    );
};

export default HowCareLinkWorks;
