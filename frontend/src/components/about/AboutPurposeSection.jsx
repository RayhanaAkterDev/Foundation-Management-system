import React from 'react';
import Card from '../common/Card';
import SectionHeading from '../common/SectionHeading';

const AboutPurposeSection = () => {
    return (
        <section className="section-gap bg-linear-to-b from-white via-[#FAFCFA] to-[#F5FAF6] border-t border-primary/8 overflow-hidden relative">
            {/* soft top ambient wash */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(52,168,83,0.05),transparent_58%)] pointer-events-none" />

            {/* subtle bottom blend */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-primary/3 to-transparent pointer-events-none" />

            <div className="container-width relative flex flex-col items-center gap-10">
                {/* TOP STORY BLOCK */}
                <div className="max-w-3xl text-center flex flex-col gap-5">
                    <SectionHeading
                        title={
                            <>
                                Why CareLink{' '}
                                <span className="text-accent">Exists</span>
                            </>
                        }
                        headingClass="text-primary"
                        description="We built CareLink to fix a simple but broken reality in humanitarian support."
                    />

                    <p className="text-text-secondary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Help exists everywhere — but it rarely reaches people in
                        the right way, at the right time, with the right
                        coordination.
                    </p>
                </div>

                <div className="w-16 h-0.5 bg-primary/70 rounded-full" />

                <div className="max-w-xl text-center">
                    <p className="text-primary/70 font-medium italic text-sm sm:text-base">
                        CareLink exists to solve that gap through three core
                        principles:
                    </p>
                </div>

                <Card />
            </div>
        </section>
    );
};

export default AboutPurposeSection;
