import React from 'react';
import SectionHeading from '../common/SectionHeading';
import StatCard from '../common/StatCard';
import aboutImpactStats from '../../data/stats/aboutImpactStats';

const AboutImpactSection = () => {
    return (
        <section className="section-gap bg-surface border-b border-border">
            <div className="container-width">
                <SectionHeading
                    badge="CareLink in numbers"
                    title="Our Impact so far"
                    badgeClass="badge-primary"
                />

                <div className="mx-auto max-w-6xl">
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
