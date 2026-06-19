import Button from '@/components/Button';
import SectionHeading from '@/components/SectionHeading';

const VolunteerHero = () => {
    return (
        <section className="section-gap mt-14 md:mt-16 lg:mt-20 relative overflow-hidden">
            {/* Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* top glow */}
                <div className="absolute left-1/2 top-0 h-87.5 w-87.5 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl sm:h-125 sm:w-125 lg:h-162.5 lg:w-162.5" />

                {/* left glow */}
                <div className="absolute -left-32 top-52 h-65 w-65 rounded-full bg-primary/5 blur-[100px] sm:h-87.5 sm:w-87.5 lg:h-105 lg:w-105 lg:blur-[140px]" />

                {/* grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right,currentColor 1px,transparent 1px),
                            linear-gradient(to bottom,currentColor 1px,transparent 1px)
                        `,
                        backgroundSize: '64px 64px',
                    }}
                />
            </div>

            <div className="container-width relative z-10">
                <div className="grid items-center gap-14 lg:gap-20 xl:gap-28 lg:grid-cols-[1fr_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
                    {/* LEFT */}

                    <div className="max-w-3xl mx-auto lg:mx-0">
                        <SectionHeading
                            align="left"
                            badge={{
                                size: 'lg',
                                variant: 'primary',
                                label: 'Volunteer With Us',
                            }}
                            title="Be the reason someone believes in humanity again"
                            headingSize="hero"
                            description="Join a growing network of volunteers helping deliver food, medicine, and emergency aid to people who need it most. Small actions create lasting impact."
                            descriptionSize="hero"
                        />

                        <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-10">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto"
                                onClick={() => {
                                    document
                                        .getElementById('volunteer-form')
                                        ?.scrollIntoView({
                                            behavior: 'smooth',
                                        });
                                }}
                            >
                                Become a Volunteer
                            </Button>

                            <Button
                                to="/how-it-works"
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                Learn How It Works
                            </Button>
                        </div>
                    </div>

                    {/* RIGHT */}

                    <div className="relative max-w-md mx-auto w-full">
                        {/* glow behind card */}

                        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-90" />

                        {/* card */}

                        <div className="relative overflow-hidden rounded-[28px] sm:rounded-4xl border border-border/70 bg-background/80 backdrop-blur-xl shadow-xl">
                            {/* subtle top accent */}

                            <div className="h-1 w-full bg-linear-to-r from-primary/40 via-primary to-primary/40" />

                            <div className="p-6 sm:p-8 lg:p-10">
                                {/* Main Stat */}

                                <div>
                                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary">
                                        3,200+
                                    </h2>

                                    <p className="mt-2 text-base sm:text-lg font-medium text-foreground">
                                        Active Volunteers
                                    </p>
                                </div>

                                {/* divider */}

                                <div className="my-8 h-px bg-border" />

                                {/* small stats */}

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold">
                                            14
                                        </h3>

                                        <p className="mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                            Districts Served
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold">
                                            24/7
                                        </h3>

                                        <p className="mt-1 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                            Emergency Response
                                        </p>
                                    </div>
                                </div>

                                {/* divider */}

                                <div className="my-8 h-px bg-border" />

                                {/* Quote */}

                                <div>
                                    <p className="text-lg sm:text-xl font-medium leading-relaxed">
                                        Every hour matters.
                                    </p>

                                    <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                        Someone is waiting for help. Your time
                                        can change a life.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VolunteerHero;
