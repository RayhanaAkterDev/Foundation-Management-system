import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import ImpactRibbon from './ImpactRibbon';

const CampaignStory = ({ campaign }) => {
    if (!campaign) return null;

    return (
        <Motion
            variant="fadeUp"
            className="
                absolute z-10
                top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] max-w-lg
                md:top-12 md:left-12 md:translate-x-0 md:translate-y-0
            "
            transition={{ duration: 0.9 }}
        >
            <div className="rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-5 sm:p-6">
                <SectionHeading
                    align="left"
                    badge={{
                        variant: 'primary',
                        tone: 'solid',
                        size: 'md',
                        label: `${campaign.category} • ${campaign.location}`,
                    }}
                    title={campaign.title}
                    headingClass="text-white"
                    description={campaign.shortDescription}
                    descriptionClass="text-white/80"
                />

                <ImpactRibbon />
            </div>
        </Motion>
    );
};

export default CampaignStory;
