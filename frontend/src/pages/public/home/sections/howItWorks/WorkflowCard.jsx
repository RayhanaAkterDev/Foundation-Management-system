import React from 'react';

import Motion from '@/components/motion/Motion';

import { TbArrowNarrowRight } from 'react-icons/tb';

const WorkflowCard = ({ item, index, flow }) => {
    const isStrong = item.emphasis === 'strong';
    const isSoft = item.emphasis === 'soft';
    const isAccent = index === 0;
    const isLast = index === flow.length - 1;

    return (
        <Motion
            variant="fadeUp"
            className={`
                relative
                group

                ${index === 1 ? 'xl:mt-8' : ''}
                ${index === 2 ? 'xl:mt-16' : ''}
                ${index === 3 ? 'xl:mt-8' : ''}
            `}
        >
            {/* =================================================
                CONNECTOR
            ================================================== */}
            {index !== flow.length - 1 && (
                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -right-5
                        top-1/2
                        z-10
                        hidden
                        -translate-y-1/2
                        items-center
                        xl:flex
                    "
                >
                    <span
                        className={`
                            h-px
                            w-7

                            transition-colors
                            duration-300

                            ${isAccent ? 'bg-accent/25' : 'bg-primary/18'}

                            group-hover:bg-primary/35
                        `}
                    />

                    <TbArrowNarrowRight
                        size={17}
                        strokeWidth={1.7}
                        className="
                            -ml-px
                            text-primary/30

                            transition-[color,transform]
                            duration-300

                            group-hover:translate-x-0.5
                            group-hover:text-primary/60
                        "
                    />
                </div>
            )}

            {/* =================================================
                CARD
            ================================================== */}
            <Motion
                whileHover={{ y: -4 }}
                transition={{
                    duration: 0.28,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className={`
                    relative
                    flex
                    h-full
                    min-h-65
                    flex-col
                    overflow-hidden
                    rounded-[14px]
                    border

                    p-6
                    sm:p-7
                    lg:p-7

                    transition-[border-color,background-color]
                    duration-300

                    ${
                        isAccent
                            ? `
                                border-accent/25
                                bg-accent-soft/60

                                hover:border-accent/40
                                hover:bg-accent-soft/75
                            `
                            : isLast
                              ? `
                                    border-primary/20
                                    bg-primary-soft/55

                                    hover:border-primary/35
                                    hover:bg-primary-soft/70
                                `
                              : isStrong
                                ? `
                                    border-primary/18
                                    bg-primary-soft/35

                                    hover:border-primary/30
                                    hover:bg-primary-soft/55
                                `
                                : isSoft
                                  ? `
                                        border-border
                                        bg-surface

                                        hover:border-primary/20
                                        hover:bg-surface-teal/30
                                    `
                                  : `
                                        border-border
                                        bg-surface

                                        hover:border-primary/20
                                        hover:bg-surface-teal/25
                                    `
                    }
                `}
            >
                {/* =================================================
                    SUBTLE EDGE ACCENT
                ================================================== */}
                <span
                    aria-hidden="true"
                    className={`
                        absolute
                        left-0
                        top-6
                        bottom-6
                        w-[2px]
                        rounded-r-full

                        ${
                            isAccent
                                ? 'bg-accent/65'
                                : isLast
                                  ? 'bg-primary/55'
                                  : isStrong
                                    ? 'bg-primary/35'
                                    : 'bg-transparent'
                        }
                    `}
                />

                {/* =================================================
                    HEADER
                ================================================== */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        {/* STEP NUMBER */}
                        <span
                            className={`
                                inline-flex
                                h-9
                                min-w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                px-2

                                font-sans
                                text-[13px]
                                font-semibold
                                leading-none

                                sm:h-9
                                sm:min-w-9
                                sm:text-[13px]

                                ${
                                    isAccent
                                        ? `
                                            border-accent/25
                                            bg-accent/10
                                            text-accent-hover
                                        `
                                        : isLast || isStrong
                                          ? `
                                                border-primary/20
                                                bg-primary/10
                                                text-primary
                                            `
                                          : `
                                                border-border
                                                bg-background
                                                text-text-secondary
                                            `
                                }
                            `}
                        >
                            {item.step}
                        </span>

                        <span
                            className={`
                                font-bengali
                                text-[15px]
                                font-medium
                                leading-[1.4]

                                sm:text-[15px]

                                ${
                                    isAccent
                                        ? 'text-accent-hover'
                                        : isLast || isStrong
                                          ? 'text-primary'
                                          : 'text-text-secondary'
                                }
                            `}
                        >
                            ধাপ
                        </span>
                    </div>

                    {/* STATUS DOT */}
                    <span
                        aria-hidden="true"
                        className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full

                            ${
                                isAccent
                                    ? 'bg-accent'
                                    : isLast
                                      ? 'bg-primary'
                                      : isStrong
                                        ? 'bg-primary/60'
                                        : 'bg-primary/25'
                            }
                        `}
                    />
                </div>

                {/* =================================================
                    CONTENT
                ================================================== */}
                <div className="mt-8">
                    <h3
                        className="
                            max-w-[18rem]

                            font-bengali
                            text-[21px]
                            font-medium
                            leading-[1.45]
                            tracking-normal
                            text-text-primary

                            sm:text-[22px]
                            lg:text-[22px]
                        "
                    >
                        {item.title}
                    </h3>

                    {/* SHORT CONTENT MARKER */}
                    <div
                        aria-hidden="true"
                        className={`
                            mt-5
                            h-px
                            w-10
                            ${
                                isAccent
                                    ? 'bg-accent/55'
                                    : isLast || isStrong
                                      ? 'bg-primary/45'
                                      : 'bg-primary/25'
                            }
                        `}
                    />

                    <p
                        className="
                            mt-6
                            max-w-[21rem]

                            font-bengali
                            text-[15px]
                            font-normal
                            leading-[1.82]
                            tracking-normal
                            text-text-body

                            sm:text-[15.5px]
                            lg:text-[16px]
                        "
                    >
                        {item.desc}
                    </p>
                </div>

                {/* =================================================
                    STRONG STATE
                ================================================== */}
                {/* {isStrong && (
                    <div
                        className="
                            mt-auto
                            flex
                            items-start
                            gap-2.5

                            pt-6

                            font-bengali
                            text-[15px]
                            font-medium
                            leading-[1.72]
                            text-primary

                            sm:text-[15.5px]
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                mt-[0.58rem]
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
                )} */}
            </Motion>
        </Motion>
    );
};

export default WorkflowCard;
