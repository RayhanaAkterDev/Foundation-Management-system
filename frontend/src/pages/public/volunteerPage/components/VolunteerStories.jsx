import SectionHeading from '@/components/SectionHeading';

const stories = [
    {
        quote: 'I started as a student volunteer. Now I’ve helped deliver aid to over 200 families.',
        name: 'Ayesha Rahman',
        role: 'Student Volunteer',
    },
    {
        quote: 'Even 2 hours a week made me feel like I’m part of something meaningful.',
        name: 'Tanvir Hasan',
        role: 'Community Volunteer',
    },
];

const VolunteerStories = () => {
    return (
        <section className="section-gap container-width">
            {/* HEADER */}
            <SectionHeading
                title="Voices from volunteers"
                headingSize="sectionHero"
                description="Real experiences from people actively contributing to communities."
                descriptionSize="hero"
            />

            {/* SYSTEM LIST */}
            <div className="mt-14 border-t border-gray-200">
                {stories.map((s, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-6 md:gap-10 py-8 md:py-10 border-b border-gray-200"
                    >
                        {/* INDEX COLUMN */}
                        <div className="text-xs tracking-[0.35em] text-gray-400 uppercase">
                            {String(i + 1).padStart(2, '0')}
                        </div>

                        {/* CONTENT */}
                        <div className="space-y-5">
                            {/* QUOTE */}
                            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed text-gray-900">
                                “{s.quote}”
                            </p>

                            {/* META ROW */}
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    {/* subtle visual marker (NOT card) */}
                                    <span className="h-px w-6 bg-gray-300" />

                                    <div>
                                        <p className="text-sm sm:text-base font-medium text-gray-900">
                                            {s.name}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-500">
                                            {s.role}
                                        </p>
                                    </div>
                                </div>

                                {/* optional tag style indicator */}
                                <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">
                                    Volunteer Story
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default VolunteerStories;
