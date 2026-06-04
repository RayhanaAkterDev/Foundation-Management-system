import React from 'react';

const stats = [
    {
        label: 'Active Campaigns',
        value: '28',
    },
    {
        label: 'Urgent Needs Today',
        value: '6',
    },
    {
        label: 'Recently Updated',
        value: '14',
    },
    {
        label: 'Verified Campaigns',
        value: '100%',
    },
];

const Stats = () => {
    const [primary, ...rest] = stats;

    return (
        <section className="bg-primary">
            <div className="container-width py-16 md:py-20">
                {/* Header */}
                <div className="text-center mb-12 md:mb-14">
                    <h2 className="text-white text-2xl md:text-3xl font-semibold">
                        Impact Overview
                    </h2>
                    <p className="text-white/60 mt-2 text-sm md:text-base">
                        Key metrics reflecting our humanitarian efforts
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-stretch">
                    {/* Primary Stat */}
                    <div
                        className="lg:col-span-1 relative overflow-hidden rounded-3xl px-8 py-10
                        bg-white/5 border border-white/10
                        flex flex-col justify-center text-center"
                    >
                        {primary.icon && (
                            <div className="mb-5 flex justify-center text-accent">
                                <primary.icon className="size-8 md:size-9" />
                            </div>
                        )}

                        <div className="text-6xl md:text-7xl font-bold text-white tracking-tight">
                            {primary.value}
                        </div>

                        <p className="mt-3 text-white/70 text-base md:text-lg">
                            {primary.label}
                        </p>
                    </div>

                    {/* Supporting Stats */}
                    <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
                        {rest.map((stat) => (
                            <div
                                key={stat.id || stat.label}
                                className="group relative rounded-2xl p-6
                                bg-white/3 border border-white/10
                                hover:bg-white/6
                                transition-all duration-300"
                            >
                                {/* subtle hover accent */}
                                <div className="absolute inset-x-0 top-0 h-px bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                                {stat.icon && (
                                    <div className="mb-3 flex justify-center text-white/70 group-hover:text-accent transition-colors">
                                        <stat.icon className="size-6" />
                                    </div>
                                )}

                                <div className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                    {stat.value}
                                </div>

                                <p className="text-sm text-white/60 mt-1 leading-relaxed">
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
