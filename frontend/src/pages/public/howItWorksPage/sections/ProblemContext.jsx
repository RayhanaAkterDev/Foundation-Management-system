import React from 'react';
import SectionHeading from '@/components/SectionHeading';

const ProblemContext = () => {
    return (
        <section className="pb-12 md:pb-16 lg:pb-20 bg-surface">
            <div className="container-width">
                <div
                    className="
                    grid lg:grid-cols-2
                    gap-8 lg:gap-12
                    items-stretch
                    bg-background
                    border border-border
                    rounded-2xl
                    overflow-hidden
                "
                >
                    {/* LEFT CONTENT */}
                    <div
                        className="
                        order-2 lg:order-1
                        p-6 sm:p-8 md:p-10 lg:p-12
                    "
                    >
                        <SectionHeading
                            align="left"
                            title="Why this system exists"
                            headingSize="sectionHero"
                            headingClass="leading-tight tracking-normal text-text-primary"
                            description="Real-world aid distribution breaks not from lack of intent, but from lack of structure."
                            descriptionSize="section"
                            descriptionClass="font-poppins"
                        />

                        <div
                            className="
                            mt-6 md:mt-8
                            space-y-4 md:space-y-5
                            text-text-secondary
                            leading-relaxed
                            text-base md:text-[16px]
                        "
                        >
                            <p>
                                In times of crisis, people often struggle to
                                find help quickly, while donors and volunteers
                                struggle to understand where their support is
                                needed most.
                            </p>

                            <p>
                                Information is scattered, communication is
                                fragmented, and good intentions are frequently
                                slowed down by uncertainty and lack of
                                coordination.
                            </p>

                            <p>
                                As a result, urgent needs may wait longer than
                                they should—not because people don't care, but
                                because there is no simple and trustworthy way
                                to connect needs with support.
                            </p>

                            <p>
                                Stand For People was created to bridge this gap
                                and make community support more transparent,
                                coordinated, and accessible.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div
                        className="
                        relative
                        order-1 lg:order-2
                        min-h-64 sm:min-h-80 lg:min-h-full
                    "
                    >
                        <img
                            src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
                            alt="Community support and humanitarian aid coordination"
                            className="w-full h-full object-cover"
                        />

                        {/* softer overlay (less harsh than before) */}
                        <div
                            className="
                            absolute inset-0
                            bg-linear-to-l
                            from-background/50
                            via-background/10
                            to-transparent
                        "
                        />

                        {/* label */}
                        <div
                            className="
                            absolute bottom-4 left-4
                            text-[11px] sm:text-xs
                            text-text-secondary
                            bg-surface/80
                            border border-border
                            backdrop-blur-md
                            px-2.5 py-1
                            rounded-md
                        "
                        >
                            Real-world coordination challenges
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProblemContext;
