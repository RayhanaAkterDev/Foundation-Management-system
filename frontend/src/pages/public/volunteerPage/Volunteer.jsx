import VolunteerHero from './components/VolunteerHero';
// import VolunteerImpact from './components/VolunteerImpact';
// import VolunteerRoles from './components/VolunteerRoles';
// import VolunteerStories from './components/VolunteerStories';
// import VolunteerJourney from './components/VolunteerJourney';
// import VolunteerBenefits from './components/VolunteerBenefits';
// import VolunteerCTA from './components/VolunteerCTA';
// import VolunteerForm from './components/VolunteerForm';
// import VolunteerFAQ from './components/VolunteerFAQ';

const Volunteer = () => {
    return (
        <main className="relative overflow-hidden bg-background pt-24 pb-24">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* top glow */}
                <div className="absolute left-1/2 top-0 h-162.5 w-162.5 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

                {/* left glow */}
                <div className="absolute -left-40 top-140 h-120 w-120 rounded-full bg-primary/5 blur-[140px]" />

                {/* right glow */}
                <div className="absolute -right-48 top-260 h-136 w-136 rounded-full bg-accent/10 blur-[160px]" />

                {/* grid */}
                <div
                    className="absolute inset-0 opacity-[0.035]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right,currentColor 1px,transparent 1px),
                            linear-gradient(to bottom,currentColor 1px,transparent 1px)
                        `,
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            <div className="relative container-width space-y-32">
                <VolunteerHero />
                {/* <VolunteerImpact />
                <VolunteerRoles />
                <VolunteerStories />
                <VolunteerJourney />
                <VolunteerBenefits />
                <VolunteerCTA />
                <VolunteerForm />
                <VolunteerFAQ /> */}
            </div>
        </main>
    );
};

export default Volunteer;
