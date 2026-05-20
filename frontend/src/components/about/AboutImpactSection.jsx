import React from 'react';
import SectionHeading from '../common/SectionHeading';
import StatCard from '../common/StatCard';
import aboutImpactStats from '../../data/stats/aboutImpactStats';

const AboutImpactSection = () => {
    return (
        <section className="pt-20">
            <div className="container-width">
                <SectionHeading
                    // title="Our Impact so far"
                    // badge="CareLink in numbers"
                    headingClass="text-primary"
                    badgeClass="badge-primary font-medium!"
                />

                <div className="mx-auto max-w-6xl">
                    {/* <div className="h-0.5 w-24 flex items-center m-auto bg-primary/80 my-8"></div> */}
                    <StatCard
                        size="lg"
                        variant="column"
                        align="center"
                        stats={aboutImpactStats}
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutImpactSection;
