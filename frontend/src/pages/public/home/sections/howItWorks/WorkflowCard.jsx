import React from 'react';
import Motion from '@/components/motion/Motion';
import { TbArrowNarrowRight } from 'react-icons/tb';

const WorkflowCard = ({ item, index, flow }) => {
    const isStrong = item.emphasis === 'strong';
    const isSoft = item.emphasis === 'soft';
    const isAccent = index === 0;

    return (
        <Motion
            variant="fadeUp"
            className={`
                relative group

                ${index === 1 ? 'xl:mt-10' : ''}
                ${index === 2 ? 'xl:mt-20' : ''}
                ${index === 3 ? 'xl:mt-10' : ''}
            `}
        >
            {/* CONNECTOR */}
            {index !== flow.length - 1 && (
                <div className="hidden xl:flex absolute top-18 -right-4 items-center z-10">
                    <div className="relative w-10 h-px bg-primary/10 overflow-hidden">
                        <div className="absolute inset-0 bg-primary/30 blur-sm opacity-40 group-hover:opacity-70 transition duration-300" />
                    </div>

                    <TbArrowNarrowRight
                        size={16}
                        className="text-primary/40 group-hover:text-primary/80 transition-colors duration-300"
                    />
                </div>
            )}

            {/* CARD */}
            <Motion
                whileHover={{ y: -5 }}
                transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                    relative rounded-3xl border backdrop-blur-sm

                    p-5 sm:p-6 lg:p-8
                    min-h-65 md:h-full xl:min-h-65

                    transition-colors duration-500

                    ${
                        isAccent
                            ? 'bg-accent/5 border-accent/25'
                            : isStrong
                              ? 'bg-primary/8 border-primary/25 shadow-lg shadow-primary/10'
                              : isSoft
                                ? 'bg-primary/4 border-primary/15'
                                : 'bg-surface/70 border-border hover:border-primary/25'
                    }
                `}
            >
                {/* STEP */}
                <div className="flex items-center justify-between">
                    <span
                        className={`
                            text-xs sm:text-sm uppercase font-semibold tracking-tight
                            ${isAccent ? 'text-accent' : 'text-primary/60'}
                        `}
                    >
                        Step {item.step}
                    </span>
                </div>

                {/* TITLE */}
                <h3 className="mt-6 text-[18px] sm:text-[20px] lg:text-[22px] font-semibold">
                    {item.title}
                </h3>

                {/* LINE */}
                <Motion
                    variant="widthReveal"
                    className={`mt-3 h-0.5 rounded-full ${
                        isAccent ? 'bg-accent/60' : 'bg-primary/40'
                    }`}
                />

                {/* DESC */}
                <p className="mt-4 text-[14px] sm:text-[15px] leading-[1.8] text-text-secondary">
                    {item.desc}
                </p>

                {isStrong && (
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Support delivered where it's needed most
                    </div>
                )}
            </Motion>
        </Motion>
    );
};

export default WorkflowCard;
