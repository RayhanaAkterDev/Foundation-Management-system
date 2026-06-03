import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import ImpactRibbon from './ImpactRibbon';

const CampaignStory = () => {
    return (
        <Motion
            variant="fadeUp"
            className="
                absolute z-10
                top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[90%] max-w-lg

                md:top-12 md:left-12 md:translate-x-0 md:translate-y-0 lg:max-w-lg
            "
            transition={{ duration: 0.9 }}
        >
            <div
                className="
                rounded-2xl
                bg-slate-950/30
                backdrop-blur-md
                border border-white/10
                p-5 sm:p-6
            "
            >
                <SectionHeading
                    align="left"
                    badge={{
                        variant: 'primary',
                        tone: 'solid',
                        size: 'md',
                        label: 'Flood Relief • Khulna, Bangladesh',
                    }}
                    title="Flood-affected communities in Khulna need urgent support"
                    headingClass="text-surface"
                    description="Heavy flooding in Khulna has displaced thousands of families and disrupted access to basic services. Relief efforts are currently underway."
                    descriptionClass="text-surface/80!"
                />

                <ImpactRibbon />
            </div>
        </Motion>
    );
};

export default CampaignStory;
