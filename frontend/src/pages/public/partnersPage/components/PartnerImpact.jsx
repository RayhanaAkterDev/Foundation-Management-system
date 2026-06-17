import SectionHeading from '@/components/SectionHeading';
import StatCard from '@/components/StatCard';

const stats = [
    { value: '50+', label: 'Strategic Partners' },
    { value: '18K+', label: 'People Supported' },
    { value: '32', label: 'Districts Covered' },
    { value: '95%', label: 'Partner Satisfaction' },
];

const PartnerImpact = () => {
    return (
        <section
            className="section-gap container-width
            "
        >
            <SectionHeading
                badge={{
                    label: 'Impact Story',
                    variant: 'primary',
                    size: 'lg',
                }}
                title="Partnerships that transform communities."
                headingSize="sectionHero"
                headingClass="max-w-2xl mx-auto"
                description="Together we create measurable impact by combining technology, resources and human compassion."
                descriptionSize="hero"
                descriptionClass="lg:max-w-lg mx-auto"
            />

            {/* Stats */}
            <div className="mt-10 sm:mt-14 lg:mt-16">
                <StatCard stats={stats} size="hero" tone="white" />
            </div>
        </section>
    );
};

export default PartnerImpact;
