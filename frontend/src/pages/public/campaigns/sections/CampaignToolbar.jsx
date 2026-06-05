import React from 'react';
import { FiSearch } from 'react-icons/fi';
import SectionHeading from '@/components/SectionHeading';
import CampaignGrid from './campaignGrid/CampaignGrid';

const CampaignToolbar = () => {
    return (
        <section className="section-gap">
            <div className="container-width">
                {/* Discovery Controls */}
                <div className="flex flex-col gap-5">
                    <SectionHeading
                        align="left"
                        title="Explore 2,800+ campaigns"
                        headingSize="sectionHero"
                    />

                    {/* Search */}
                    <div
                        className="
                            flex items-center gap-3
                            border-b border-border
                            pt-2 pb-4
                            transition-colors
                            focus-within:border-primary/20
                        "
                    >
                        <FiSearch
                            className="
                                text-text-secondary
                                text-lg
                                shrink-0
                            "
                        />

                        <input
                            type="text"
                            placeholder="Search campaigns, causes, or locations"
                            className="
                                w-full
                                bg-transparent
                                outline-none
                                text-text-primary
                                placeholder:text-text-secondary/60
                            "
                        />
                    </div>
                </div>

                {/* Results */}
                {/* <CampaignGrid /> */}
            </div>
        </section>
    );
};

export default CampaignToolbar;
