import React from 'react';

import SectionHeading from '@/components/SectionHeading';

import FlowGrid from './WorkflowGrid';
import FlowCTA from './WorkflowLink';

const HowItWorks = () => {
    return (
        <section className="section-gap bg-background">
            <div className="container-width">
                <SectionHeading
                    gap="lg"
                    badge={{
                        label: 'Stand For People যেভাবে কাজ করে',
                        variant: 'primary',
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
                            gap-3
                            font-bengali
                            text-[13px]
                            font-medium
                            leading-[1.5]
                            tracking-normal
                            text-primary
                            sm:text-sm
                            lg:text-[15px]
                            before:content-['']
                            before:block
                            before:h-px
                            before:w-7
                            before:shrink-0
                            before:bg-primary/30
                            lg:before:w-9
                        `,
                    }}
                    title="প্রয়োজন থেকে সহায়তা — ধাপে ধাপে"
                    headingSize="sectionHero"
                    lang="bn"
                    titleClassName="
                        font-bengali
                        font-medium
                        !leading-[1.3]
                        !tracking-normal
                    "
                />

                <FlowGrid />
                <FlowCTA />
            </div>
        </section>
    );
};

export default HowItWorks;
