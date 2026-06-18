import SectionHeading from '@/components/SectionHeading';

const steps = [
    {
        title: 'Sign up quickly',
        desc: 'Create your volunteer profile in under 2 minutes with basic info.',
    },
    {
        title: 'Smart matching',
        desc: 'We connect you with nearby opportunities based on your location and availability.',
    },
    {
        title: 'Start helping',
        desc: 'Get clear instructions and start contributing with guidance and support.',
    },
    {
        title: 'See your impact',
        desc: 'Track how your actions create real change in communities over time.',
    },
];

const VolunteerJourney = () => {
    return (
        <section className="section-gap">
            <div className="container-width">
                <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-16">
                    {/* LEFT */}
                    <div>
                        <div className="lg:sticky lg:top-24">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary pb-4">
                                Journey
                            </p>
                            <SectionHeading
                                align="left"
                                title={
                                    <>
                                        Every step
                                        <br />
                                        moves you
                                        <br />
                                        forward.
                                    </>
                                }
                                description="A simple process designed to remove friction and help you start contributing immediately."
                                descriptionSize="hero"
                            />
                        </div>
                    </div>
                    {/* RIGHT */}
                    <div>
                        {steps.map((step, i) => {
                            const isLast = i === steps.length - 1;
                            return (
                                <div
                                    key={i}
                                    className={[
                                        'group grid grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr] gap-4 sm:gap-5',
                                        'py-5 sm:py-6',
                                        'border-t border-gray-200',
                                        isLast
                                            ? 'border-b border-gray-200'
                                            : '',
                                    ].join(' ')}
                                >
                                    {/* NUMBER */}
                                    <div>
                                        <span className="block text-[11px] sm:text-xs font-medium text-gray-300 transition-colors duration-300 group-hover:text-primary">
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    {/* CONTENT */}
                                    <div>
                                        <div className="flex items-start justify-between gap-3 sm:gap-4">
                                            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-primary">
                                                {step.title}
                                            </h3>
                                            <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-gray-300 transition-all duration-300 group-hover:text-primary">
                                                Step {i + 1}
                                            </span>
                                        </div>
                                        <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-base text-gray-600 leading-6 sm:leading-7">
                                            {step.desc}
                                        </p>
                                        <div className="mt-4 sm:mt-5 h-px w-0 bg-primary transition-all duration-500 group-hover:w-20" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VolunteerJourney;
