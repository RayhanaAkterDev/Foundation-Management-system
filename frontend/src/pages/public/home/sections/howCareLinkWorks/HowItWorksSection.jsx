import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import FlowGrid from './WorkflowGrid';
import FlowCTA from './WorkflowLink';

const HowCareLinkWorks = () => {
    return (
        <section className="section-gap bg-background mt-16">
            <div className="container-width">
                <SectionHeading
                    badge={{
                        label: 'How CareLink Works',
                        variant: 'primary',
                        tone: 'glass',
                        size: 'lg',
                    }}
                    title="A structured flow for real-world response"
                    headingSize="sectionHero"
                />

                <FlowGrid />
                <FlowCTA />
            </div>
        </section>
    );
};

export default HowCareLinkWorks;
