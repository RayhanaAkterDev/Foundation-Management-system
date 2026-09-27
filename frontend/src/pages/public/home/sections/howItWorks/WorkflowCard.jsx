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
            {/* DESKTOP CONNECTOR */}
            {index !== flow.length - 1 && (
                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-4
                        top-1/2
                        z-10
                        hidden
                        -translate-y-1/2
                        items-center
                        lg:flex
                        xl:-right-5
                    "
                >
                    <div
                        className={`
                            h-px
                            w-4
                            xl:w-7
                            ${isAccent ? 'bg-accent/25' : 'bg-primary/15'}
                        `}
                    />

                    <TbArrowNarrowRight
                        size={17}
                        strokeWidth={1.5}
                        className="
                            -ml-px
                            text-primary/30
                            transition-all
                            duration-300
                            group-hover:translate-x-0.5
                            group-hover:text-primary/55
                        "
                    />
                </div>
            )}

            {/* CARD */}
            <Motion
                whileHover={{ y: -2 }}
                transition={{
                    duration: 0.24,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                    relative
                    h-full
                    min-h-64
                    overflow-hidden
                    rounded-xl
                    border
                    p-5
                    sm:p-6
                    lg:min-h-80
                    lg:px-5
                    lg:py-6
                    xl:min-h-72
                    xl:p-7
                    transition-[background-color,border-color,box-shadow]
                    duration-300

                    ${
                        isAccent
                            ? `
                                border-accent/20
                                bg-accent-soft/35
                                hover:border-accent/30
                                hover:bg-accent-soft/50
                            `
                            : isStrong
                              ? `
                                    border-primary/18
                                    bg-primary-soft/35
                                    hover:border-primary/28
                                    hover:bg-primary-soft/50
                                `
                              : isSoft
                                ? `
                                    border-primary/10
                                    bg-primary-soft/12
                                    hover:border-primary/20
                                    hover:bg-primary-soft/22
                                `
                                : `
                                    border-border/80
                                    bg-surface
                                    hover:border-primary/20
                                    hover:bg-surface
                                `
                    }

                    hover:shadow-[0_10px_30px_rgba(15,118,110,0.06)]
                `}
            >
                {/* STEP */}
                <div className="flex items-center justify-between gap-4">
                    <div
                        className={`
                            flex
                            items-center
                            gap-2.5
                            font-bengali
                            text-sm
                            font-medium
                            leading-none
                            lg:text-[15px]
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
                                font-sans
                                text-[13px]
                                font-semibold
                                tracking-wide
                                ${
                                    isAccent
                                        ? 'text-accent-hover'
                                        : isStrong
                                          ? 'text-primary'
                                          : 'text-text-secondary'
                                }
                            `}
                        >
                            {item.step}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-current opacity-35" />

                        <span>ধাপ</span>
                    </div>

                    {/* TEAL DOT */}
                    <span
                        className={`
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            transition-transform
                            duration-300
                            group-hover:scale-125
                            ${
                                isAccent
                                    ? 'bg-accent/70'
                                    : isStrong
                                      ? 'bg-primary/65'
                                      : 'bg-primary/35'
                            }
                        `}
                    />
                </div>

                {/* TITLE */}
                <h3
                    className="
                        mt-7
                        max-w-[19rem]
                        font-bengali
                        text-[20px]
                        font-semibold
                        leading-[1.42]
                        tracking-normal
                        text-text-primary
                        sm:text-[22px]
                        lg:text-[21px]
                        xl:text-[23px]
                    "
                >
                    {item.title}
                </h3>

                {/* DESCRIPTION */}
                <p
                    className="
                        mt-4
                        max-w-[20rem]
                        font-bengali
                        text-[15px]
                        font-normal
                        leading-[1.75]
                        tracking-normal
                        text-text-body
                        sm:text-[16px]
                        lg:text-[15px]
                        xl:text-[16px]
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
                            font-bengali
                            text-[14px]
                            font-medium
                            leading-[1.65]
                            text-primary
                            sm:text-[15px]
                            lg:text-[14px]
                            xl:text-[15px]
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
