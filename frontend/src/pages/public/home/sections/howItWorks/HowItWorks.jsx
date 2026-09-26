import React from 'react';

import SectionHeading from '@/components/SectionHeading';

import FlowGrid from './WorkflowGrid';

import FlowCTA from './WorkflowLink';

const HowCareLinkWorks = () => {
    return (
        <section className="section-gap bg-background-alt">
            <div className="container-width">
                <SectionHeading
                    gap="lg"
                    badge={{
                        label: 'Stand For People যেভাবে কাজ করে',
                        variant: 'accent',
                        size: 'md',
                        className: `
                            !h-auto
                            !px-0
                            !py-0
                            !rounded-none
                            !border-0
                            !bg-transparent
                            !shadow-none

                            relative
                            gap-2.5

                            font-medium
                            text-accent

                            before:content-['']
                            before:block
                            before:w-7
                            before:h-px
                            before:bg-accent/60
                            before:shrink-0
                        `,
                    }}
                    title="প্রয়োজন থেকে সহায়তা—ধাপে ধাপে"
                    headingSize="sectionHero"
                />

                <FlowGrid />

                <FlowCTA />
            </div>
        </section>
    );
};

export default HowCareLinkWorks;
