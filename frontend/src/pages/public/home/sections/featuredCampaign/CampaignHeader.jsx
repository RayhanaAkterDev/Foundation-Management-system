import React from 'react';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import Motion from '@/components/motion/Motion';

const CampaignHeader = () => {
    return (
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            {/* LEFT */}
            <Motion
                variant="fadeUp"
                className="max-w-2xl"
                transition={{
                    duration: 0.85,
                }}
            >
                <SectionHeading
                    align="left"
                    badge="Featured Emergency"
                    badgeClass="badge-accent"
                    title={
                        <>
                            Real people.
                            <span className="block text-primary">
                                Real emergency response.
                            </span>
                        </>
                    }
                    headingSize="hero"
                    description="CareLink connects donors and verified emergency campaigns to deliver fast humanitarian support where it matters most."
                    descriptionSize="hero"
                />
            </Motion>
        </div>
    );
};

export default CampaignHeader;
