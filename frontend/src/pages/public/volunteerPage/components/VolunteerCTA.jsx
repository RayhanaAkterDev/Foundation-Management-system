import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';
import StatCard from '@/components/StatCard';

const stats = [
    { value: '10K+', label: 'Volunteers' },
    { value: '500+', label: 'Communities' },
    { value: '100%', label: 'Active Support' },
];

const VolunteerCTA = () => {
    return (
        <section className="section-gap bg-primary text-white">
            <div className="container-width text-center">
                {/* SMALL LABEL */}
                <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-white/70 mb-6">
                    Volunteer with StandForPeople
                </p>
                <SectionHeading
                    title={
                        <>
                            Ready to turn your time
                            <br />
                            into real-world impact?
                        </>
                    }
                    headingSize="sectionHero"
                    description={
                        <>
                            Join thousands of volunteers who are already
                            supporting communities,
                            <span className="lg: block">
                                responding to needs, and creating measurable
                                change every day.
                            </span>
                        </>
                    }
                    descriptionSize="hero"
                    descriptionClass="text-white/80!"
                />

                {/* Stats */}
                <div className="my-6 max-w-2xl mx-auto">
                    <StatCard
                        stats={stats}
                        variant="line"
                        tone="primary"
                        className="sm:grid-cols-3! lg:grid-cols-3!"
                    />
                </div>

                {/* CTA */}
                <div>
                    <Button size="lg" variant="accent">
                        Join as Volunteer
                    </Button>

                    <p className="mt-4 text-xs sm:text-sm text-white/60">
                        Takes less than 2 minutes to get started
                    </p>
                </div>
            </div>
        </section>
    );
};

export default VolunteerCTA;
