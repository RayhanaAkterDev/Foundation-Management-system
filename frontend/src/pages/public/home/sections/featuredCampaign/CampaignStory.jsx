import React from 'react';
import stats from './data/statsData';
import SectionHeading from '@/components/SectionHeading';

const CampaignStory = () => {
    return (
        <div className="absolute bottom-0 left-0 max-w-2xl p-8 lg:p-12">
            <SectionHeading
                align="left"
                title="Emergency Flood Relief for Families in Khulna"
                headingClass="text-surface"
                description="Thousands of families are displaced due to severe flooding. Volunteers are coordinating essential supplies across affected regions."
                descriptionSize="sectionHero"
                descriptionClass="text-surface/80!"
            />

            {/* STATS (MAPPED) */}
            <div className="mt-10 flex flex-wrap gap-10 text-white">
                {stats.map((item) => (
                    <div key={item.label}>
                        <p className="text-sm text-white/55">{item.label}</p>
                        <h4 className="mt-2 text-3xl font-bold">
                            {item.value}
                        </h4>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CampaignStory;
