import SectionHeading from '@/components/SectionHeading';

const benefits = [
    {
        title: 'Real-world humanitarian experience',
        desc: 'Work directly with communities and understand real impact on the ground.',
    },
    {
        title: 'Recognition & credibility',
        desc: 'Get certificates and community acknowledgment for your contributions.',
    },
    {
        title: 'Skill development',
        desc: 'Build coordination, empathy, leadership, and problem-solving abilities.',
    },
    {
        title: 'Flexible involvement',
        desc: 'Contribute based on your time and availability without pressure.',
    },
];

const VolunteerBenefits = () => {
    return (
        <section className="container-width section-gap">
            {/* HEADER */}
            <SectionHeading
                // align="left"
                title="Why volunteers stay with us"
                headingSize="sectionHero"
                description="Beyond volunteering — this is about growth, recognition, and real-world impact."
                descriptionSize="hero"
            />

            {/* LIST WRAPPER */}
            <div className="mt-12 max-w-4xl mx-auto border border-border rounded-xl overflow-hidden bg-white">
                {benefits.map((item, i) => {
                    const isLast = i === benefits.length - 1;

                    return (
                        <div
                            key={i}
                            className={[
                                'group px-5 sm:px-6 py-6 sm:py-7',
                                !isLast ? 'border-b border-border' : '',
                                'hover:bg-gray-50 transition-colors duration-300',
                            ].join(' ')}
                        >
                            <div className="flex items-start gap-4 sm:gap-5">
                                {/* INDEX */}
                                <span className="text-[11px] sm:text-xs font-medium text-gray-300 group-hover:text-primary transition-colors duration-300 mt-1">
                                    {String(i + 1).padStart(2, '0')}
                                </span>

                                {/* CONTENT */}
                                <div className="space-y-1 sm:space-y-1.5">
                                    <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors duration-300">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm sm:text-base text-gray-600 leading-6 sm:leading-7 max-w-2xl">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default VolunteerBenefits;
