import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import FlowGrid from './WorkflowGrid';
import FlowCTA from './WorkflowLink';

const HowCareLinkWorks = () => {
    return (
        <section className="section-gap bg-background">
            <div className="container-width">
                <SectionHeading
                    badge={{
                        label: 'How CareLink Works',
                        variant: 'primary',
                        tone: 'solid',
                        size: 'sm',
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
