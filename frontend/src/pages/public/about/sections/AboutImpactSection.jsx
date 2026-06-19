import React from 'react';

import SectionHeading from '@/components/SectionHeading';
import StatCard from '@/components/StatCard';

import aboutImpactStats from './data/aboutImpactStats';

const AboutImpactSection = () => {
    return (
        <section>
            <div className="container-width section-gap">
                <div className="max-w-3xl mx-auto mb-16">
                    <SectionHeading
                        align="center"
                        gap="md"
                        badgeClass="badge-accent text-surface! border-border! bg-surface/10!"
                        title="Real impact powered by people who care"
                        headingSize="sectionHero"
                        description="From emergency support to community-driven initiatives, every contribution helps us reach more lives with dignity, compassion, and meaningful support."
                        headingClass="text-surface!"
                        descriptionClass="text-surface/80!"
                    />
                </div>

                {/* stat cards */}
                <StatCard
                    size="section"
                    tone="primary"
                    variant="card"
                    align="center"
                    gridCols="lg:grid-cols-4 md:grid-cols-2"
                    stats={aboutImpactStats}
                />
            </div>
        </section>
    );
};

export default AboutImpactSection;
