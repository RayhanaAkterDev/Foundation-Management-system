import React from 'react';
import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

const CampaignHeader = () => {
    return (
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
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
            </div>

            <div className="w-full lg:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                    View All Campaigns
                </Button>
            </div>
        </div>
    );
};

export default CampaignHeader;
