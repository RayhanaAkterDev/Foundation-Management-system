import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

const CampaignHeader = () => {
    return (
        <div className="mb-8 md:mb-10 flex flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <Motion
                variant="fadeUp"
                className="max-w-2xl"
                transition={{ duration: 0.85 }}
            >
                <SectionHeading
                    align="left"
                    badge={{
                        label: 'Featured Emergency Case',
                        variant: 'primary',
                        tone: 'solid',
                        size: 'lg',
                    }}
                    title={
                        <>
                            Real people.
                            <span className="block text-primary">
                                Real emergency response.
                            </span>
                        </>
                    }
                    headingSize="sectionHero"
                    description="Featured urgent campaign currently receiving highest priority support and donations."
                    descriptionSize="sectionHero"
                />
            </Motion>
        </div>
    );
};

export default CampaignHeader;
