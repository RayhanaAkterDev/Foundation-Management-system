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
                <div
                    className="
                        hidden xl:flex
                        absolute
                        top-1/2
                        -right-5
                        -translate-y-1/2
                        items-center
                        z-10
                    "
                >
                    <div
                        className={`
                            w-8
                            h-px
                            transition-colors
                            duration-300
                            ${isAccent ? 'bg-accent/30' : 'bg-primary/20'}
                        `}
                    />

                    <TbArrowNarrowRight
                        size={17}
                        strokeWidth={1.8}
                        className="
                            -ml-px
                            text-primary/35
                            transition-all
                            duration-300
                            group-hover:translate-x-0.5
                            group-hover:text-primary/65
                        "
                    />
                </div>
            )}

            {/* CARD */}
            <Motion
                whileHover={{ y: -4 }}
                transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                    relative
                    overflow-hidden
                    rounded-2xl
                    border
                    p-5
                    sm:p-6
                    lg:p-7
                    min-h-65
                    md:h-full
                    xl:min-h-65

                    transition-all
                    duration-300

                    ${
                        isAccent
                            ? `
                                bg-accent-soft/55
                                border-accent/25
                                hover:border-accent/40
                            `
                            : isStrong
                              ? `
                                    bg-primary-soft/65
                                    border-primary/25
                                    hover:border-primary/40
                                `
                              : isSoft
                                ? `
                                      bg-primary-soft/30
                                      border-primary/15
                                      hover:border-primary/30
                                  `
                                : `
                                      bg-surface
                                      border-border
                                      hover:border-primary/25
                                  `
                    }
                `}
            >
                {/* TOP ACCENT */}
                <div
                    className={`
                        absolute
                        inset-x-0
                        top-0
                        h-0.5
                        ${
                            isAccent
                                ? 'bg-accent/70'
                                : isStrong
                                  ? 'bg-primary/55'
                                  : 'bg-primary/20'
                        }
                    `}
                />

                {/* STEP + INDEX MARK */}
                <div className="flex items-center justify-between">
                    <span
                        className={`
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            sm:text-sm
                            font-medium
                            tracking-normal

                            ${
                                isAccent
                                    ? 'text-accent-hover'
                                    : isStrong
                                      ? 'text-primary'
                                      : 'text-text-secondary'
                            }
                        `}
                    >
                        <span
                            className={`
                                flex
                                h-6
                                min-w-6
                                items-center
                                justify-center
                                rounded-md
                                border
                                px-1.5
                                text-[11px]
                                font-semibold

                                ${
                                    isAccent
                                        ? 'border-accent/25 bg-accent/10 text-accent-hover'
                                        : isStrong
                                          ? 'border-primary/20 bg-primary/10 text-primary'
                                          : 'border-border bg-surface/70 text-text-secondary'
                                }
                            `}
                        >
                            {item.step}
                        </span>

                        <span>ধাপ</span>
                    </span>

                    <span
                        className={`
                            h-1.5
                            w-1.5
                            rounded-full
                            ${
                                isAccent
                                    ? 'bg-accent/70'
                                    : isStrong
                                      ? 'bg-primary/60'
                                      : 'bg-primary/25'
                            }
                        `}
                    />
                </div>

                {/* TITLE */}
                <h3
                    className="
                        mt-6
                        max-w-[18rem]
                        text-[19px]
                        sm:text-[21px]
                        lg:text-[22px]

                        font-bold
                        leading-[1.4]
                        tracking-normal

                        text-text-primary

                        font-bengali
                    "
                >
                    {item.title}
                </h3>

                {/* DIVIDER */}
                <div
                    className={`
                        mt-4
                        h-px
                        w-10
                        transition-all
                        duration-300
                        group-hover:w-14
                        ${
                            isAccent
                                ? 'bg-accent/60'
                                : isStrong
                                  ? 'bg-primary/50'
                                  : 'bg-primary/30'
                        }
                    `}
                />

                {/* DESCRIPTION */}
                <p
                    className="
                        mt-5
                        text-[14px]
                        sm:text-[15px]
                        font-bengali
                        font-normal
                        leading-[1.85]
                        tracking-normal
                        text-text-body
                    "
                >
                    {item.desc}
                </p>

                {/* STRONG STATE */}
                {isStrong && (
                    <div
                        className="
                            mt-6
                            flex
                            items-start
                            gap-2.5
                            border-t
                            border-primary/10
                            pt-4
                            text-sm
                            font-bengali
                            font-medium
                            leading-[1.7]
                            text-primary
                        "
                    >
                        <span
                            className="
                                mt-[0.55rem]
                                h-1.5
                                w-1.5
                                shrink-0
                                rounded-full
                                bg-primary
                            "
                        />

                        <span>
                            যেখানে প্রয়োজন সবচেয়ে বেশি, সেখানেই সহায়তা পৌঁছে
                            দিই
                        </span>
                    </div>
                )}
            </Motion>
        </Motion>
    );
};

export default WorkflowCard;
