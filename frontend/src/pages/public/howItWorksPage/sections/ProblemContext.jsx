import React from 'react';
import SectionHeading from '@/components/SectionHeading';

const ProblemContext = () => {
    return (
        <section className="pb-14 md:pb-16 lg:pb-20 bg-surface">
            <div className="container-width">
                <div
                    className="
                    grid lg:grid-cols-2 gap-8
                    items-stretch
                    bg-background rounded-2xl overflow-hidden border border-border
                "
                >
                    {/* LEFT CONTENT */}
                    <div className="p-6 md:p-10 lg:p-12 order-2 lg:order-1">
                        <SectionHeading
                            align="left"
                            title="Why this system exists"
                            headingSize="sectionHero"
                            headingClass="tracking-normal leading-tight"
                            description="Real-world aid distribution breaks not from lack of intent, but from lack of structure."
                            descriptionSize="sectionHero"
                        />

                        <div
                            className="
                            mt-6 md:mt-8
                            space-y-4 md:space-y-5
                            text-text-secondary/90 leading-relaxed
                            text-base md:text-[17px] lg:text-lg
                        "
                        >
                            <p>
                                In crisis situations, help requests often arrive
                                in unstructured, incomplete, or duplicated
                                forms—making it difficult to determine what is
                                truly urgent and actionable.
                            </p>

                            <p>
                                Donors and volunteers also lack a reliable way
                                to verify authenticity or priority. As a result,
                                decisions are made using fragmented information,
                                slowing response and reducing accuracy.
                            </p>

                            <p>
                                Over time, this creates a system where critical
                                needs are buried in noise—not due to lack of
                                support, but because there is no structured
                                layer to organize, validate, and prioritize
                                requests.
                            </p>

                            <p className="text-text-primary/80 font-medium">
                                Stand For People introduces structure,
                                validation, and traceability to solve this gap.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT IMAGE */}
                    <div
                        className="
                        relative
                        w-full
                        min-h-65 sm:min-h-80 md:min-h-full order-1 lg:order-2
                    "
                    >
                        <img
                            src="https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80"
                            alt="Community support and humanitarian aid coordination"
                            className="w-full h-full object-cover"
                        />

                        {/* overlay for readability */}
                        <div
                            className="
                            absolute inset-0
                            bg-linear-to-l from-background/40 via-background/10 to-transparent
                        "
                        />

                        {/* label */}
                        <div
                            className="
                            absolute bottom-4 left-4
                            text-[11px] sm:text-xs
                            text-white/70
                            backdrop-blur-sm
                            px-2 py-1 rounded-md
                            bg-black/20
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
