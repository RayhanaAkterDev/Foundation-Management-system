import React from 'react';
import { TbCheck } from 'react-icons/tb';
import Motion from '@/components/motion/Motion';
import Diagram from './diagrams/Diagram';
import SectionHeading from '@/components/SectionHeading';

const ProcessScene = ({ step, title, desc, bullets, type, reverse }) => {
    return (
        <section className="container-width py-2 sm:py-4">
            <div
                className="
                    grid
                    grid-cols-1
                    lg:grid-cols-2
                    gap-10
                    lg:gap-20
                    items-center
                "
            >
                {/* TEXT SIDE */}
                <div className={reverse ? 'lg:order-2' : ''}>
                    <Motion>
                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary/60 mb-4 sm:mb-5">
                            Step {step}
                        </p>

                        <SectionHeading
                            gap="md"
                            align="left"
                            title={title}
                            description={desc}
                            descriptionSize="hero"
                        />

                        <div className="mt-6 sm:mt-10 space-y-3">
                            {bullets.map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-3 sm:gap-4"
                                >
                                    <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <TbCheck className="text-primary text-sm sm:text-base" />
                                    </div>

                                    <p className="text-base lg:text-lg text-text-secondary">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Motion>
                </div>

                {/* VISUAL SIDE */}
                <div className={reverse ? 'lg:order-1' : ''}>
                    <div
                        className="
                            relative
                            min-h-90
                            sm:min-h-90
                            lg:min-h-105

                            rounded-2xl
                            lg:rounded-[36px]

                            border border-border
                            bg-surface

                            flex items-center justify-center

                            p-5 sm:p-8 lg:p-10

                            overflow-hidden
                        "
                    >
                        <Diagram type={type} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessScene;
