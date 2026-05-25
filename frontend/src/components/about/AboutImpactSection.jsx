import React from 'react';

import SectionHeading from '../common/SectionHeading';
import StatCard from '../common/StatCard';

import aboutImpactStats from '../../data/stats/aboutImpactStats';

const AboutImpactSection = () => {
    return (
        <section>
            <div className="container-width">
                <div className="mx-auto max-w-3xl">
                    <SectionHeading
                        align="center"
                        gap="md"
                        badge="CareLink in numbers"
                        badgeClass="badge-accent text-surface! border-border! bg-surface/10!"
                        title="Real impact powered by people who care"
                        description="From emergency support to community-driven initiatives, every contribution helps us reach more lives with dignity, compassion, and meaningful support."
                        headingClass="text-surface!"
                        descriptionClass="text-surface/80!"
                    />
                </div>

                {/* stat cards */}
                <div className="mx-auto mt-14 max-w-6xl">
                    <StatCard
                        size="lg"
                        variant="column"
                        align="center"
                        gridCols="lg:grid-cols-4 md:grid-cols-2"
                        stats={aboutImpactStats}
                    />
                </div>
            </div>
        </section>
    );
};

export default AboutImpactSection;
