import React from 'react';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';
import ImpactRibbon from './ImpactRibbon';

const CampaignStory = () => {
    return (
        <Motion
            variant="fadeUp"
            className="absolute top-28 left-16 max-w-lg"
            transition={{
                duration: 0.9,
            }}
        >
            <SectionHeading
                align="left"
                badge={{
                    variant: 'primary',
                    tone: 'solid',
                    size: 'md',
                    label: 'Flood Relief •  Khulna, Bangladesh',
                }}
                title="Flood-affected communities in Khulna need urgent support"
                headingClass="text-surface"
                description="Heavy flooding in Khulna has displaced thousands of families and disrupted access to basic services. Relief efforts are currently underway."
                descriptionClass="text-surface/80!"
            />

            {/* IMPACT RIBBON */}
            <ImpactRibbon />
        </Motion>
    );
};

export default CampaignStory;
