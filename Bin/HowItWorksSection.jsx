import React from 'react';
import { TbArrowNarrowRight } from 'react-icons/tb';
import SectionHeading from '@/components/SectionHeading';

const steps = [
    {
        title: "A need is shared",
        desc: "A person or community submits a request for help through CareLink’s simple intake system."
    },
    {
        title: "We verify the reality",
        desc: "AI + community validation filters duplicates, fraud, and unclear requests."
    },
    {
        title: "We match support",
        desc: "Volunteers, donors, and organizations are intelligently connected to the right cases."
    },
    {
        title: "Impact reaches back",
        desc: "Aid is delivered with transparency, and outcomes are tracked for trust."
    }
];

const HowCareLinkWorksSignature = () => {
    return (
        <section className="section-gap bg-background relative overflow-hidden">
            <div className="container-width">

                <SectionHeading
                    badge="How CareLink Works"
                    badgeClass="badge-primary"
                    title="From need to impact — one continuous flow"
                    description="Not separate steps. One connected system where every action leads to real-world change."
                />

                {/* Flow Container */}
                <div className="mt-16 relative">

                    {/* CENTRAL FLOW LINE (key emotional anchor) */}
                    <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden xl:block" />

                    <div className="space-y-20">

                        {steps.map((item, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <div
                                    key={index}
                                    className={`relative flex flex-col xl:flex-row items-center xl:items-start ${
                                        isLeft ? 'xl:flex-row' : 'xl:flex-row-reverse'
                                    }`}
                                >

                                    {/* CONTENT BOX */}
                                    <div className="w-full xl:w-1/2 flex justify-center">

                                        <div className="relative max-w-md p-6 rounded-2xl border border-border bg-white/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">

                                            {/* Step indicator attached to flow line */}
                                            <div className="absolute -top-3 left-6 flex items-center gap-2">
                                                <span className="h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <div className="text-xs text-primary font-medium">
                                                    Step
                                                </div>
                                            </div>

                                            <h3 className="text-lg font-semibold text-text-primary mt-4">
                                                {item.title}
                                            </h3>

                                            <p className="mt-3 text-sm text-text-secondary leading-6">
                                                {item.desc}
                                            </p>

                                        </div>
                                    </div>

                                    {/* CENTER NODE */}
                                    <div className="hidden xl:flex w-12 justify-center relative">
                                        <div className="h-3 w-3 rounded-full bg-primary shadow-md shadow-primary/20 z-10" />

                                        {index !== steps.length - 1 && (
                                            <div className="absolute top-6 flex flex-col items-center">
                                                <div className="h-20 w-px border-l border-dashed border-primary/30" />
                                                <TbArrowNarrowRight
                                                    className="text-primary/40 mt-1"
                                                    size={14}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* EMPTY SIDE FOR BALANCE */}
                                    <div className="w-full xl:w-1/2" />

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowCareLinkWorksSignature;