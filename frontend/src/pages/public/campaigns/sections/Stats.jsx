import React from 'react';
import SectionHeading from '@/components/SectionHeading';

const stats = [
    {
        label: 'Active Campaigns',
        value: '10+',
    },
    {
        label: 'Urgent Needs Today',
        value: '6',
    },
    {
        label: 'Recently Updated',
        value: '4',
    },
    {
        label: 'Verified Campaigns',
        value: '100%',
    },
    {
        label: 'Total Supporters',
        value: '1k+',
    },
];

const Stats = () => {
    const [primary, ...rest] = stats;

    return (
        <section className="border-t border-border bg-primary section-gap">
            <div className="container-width">
                {/* Header */}
                <SectionHeading
                    gap="sm"
                    title="Impact Overview"
                    headingClass="text-surface"
                    headingSize="sectionHero"
                    description="Key metrics reflecting our humanitarian efforts"
                    descriptionClass="text-surface/80!"
                    descriptionSize="sectionHero"
                />

                {/* Stats Layout */}
                <div className="mt-10 md:mt-12 grid gap-6 md:gap-8 lg:grid-cols-3 items-stretch">
                    {/* Primary Stat */}
                    <div
                        className="
                            lg:col-span-1
                            relative overflow-hidden
                            rounded-2xl md:rounded-3xl
                            bg-white
                            border border-border
                            px-6 sm:px-8
                            py-8 sm:py-10
                            flex flex-col justify-center
                            text-center
                        "
                    >
                        {primary.icon && (
                            <div className="mb-4 md:mb-5 flex justify-center text-accent">
                                <primary.icon className="size-7 md:size-9" />
                            </div>
                        )}

                        <div
                            className="
                                text-5xl
                                sm:text-6xl
                                md:text-7xl
                                font-bold
                                tracking-tight
                            "
                        >
                            {primary.value}
                        </div>

                        <p
                            className="
                                mt-2 md:mt-3
                                text-sm sm:text-base md:text-lg
                                text-text-secondary
                            "
                        >
                            {primary.label}
                        </p>
                    </div>

                    {/* Supporting Stats */}
                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                        {rest.map((stat) => (
                            <div
                                key={stat.id || stat.label}
                                className="
    group
    relative
    overflow-hidden
    rounded-xl md:rounded-2xl
    p-5 md:p-6
    bg-white
    border border-border

    transition-all duration-300 ease-out

    hover:-translate-y-0.5
    hover:border-accent/30
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)]
"
                            >
                                {/* Accent line */}
                                <div
                                    className="
            absolute left-0 top-0
            h-0.5 w-full
            origin-left scale-x-0
            bg-accent
            transition-transform duration-300
            group-hover:scale-x-100
        "
                                />

                                <div
                                    className="
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-bold
            tracking-tight
            text-text-primary
        "
                                >
                                    {stat.value}
                                </div>

                                <p
                                    className="
            mt-1
            text-xs sm:text-sm
            leading-relaxed
            text-text-secondary
        "
                                >
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
