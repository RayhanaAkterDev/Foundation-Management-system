import React from 'react';
import { Link } from 'react-router-dom';
import { TbArrowNarrowRight } from 'react-icons/tb';

// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

import SectionHeading from '@/components/SectionHeading';

const flow = [
    {
        step: '01',
        title: 'Needs Go Unnoticed',
        desc: 'Urgent community needs are often lost in scattered communication, delayed reporting, and lack of verification.',
        emphasis: 'soft',
    },
    {
        step: '02',
        title: 'Requests Get Submitted',
        desc: 'CareLink helps individuals and volunteers submit real-world needs through a guided and structured reporting flow.',
    },
    {
        step: '03',
        title: 'CareLink Verifies Everything',
        desc: 'AI validation, duplicate detection, and priority scoring organize every request into reliable and actionable data.',
    },
    {
        step: '04',
        title: 'Support Reaches Faster',
        desc: 'Verified requests connect with donors and volunteers faster — improving transparency, coordination, and measurable impact.',
        emphasis: 'strong',
    },
];

/* MOTION */
const containerVariants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 24,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const lineVariants = {
    hidden: {
        scaleX: 0,
        opacity: 0,
    },
    show: {
        scaleX: 1,
        opacity: 1,
        transition: {
            duration: 1,
            ease: [0.22, 1, 0.36, 1],
            delay: 0.15,
        },
    },
};

const HowCareLinkWorks = () => {
    return (
        <section className="section-gap bg-background overflow-hidden">
            <div className="container-width">
                {/* HEADER */}
                <SectionHeading
                    badgeClass="badge-primary"
                    badge="How CareLink Works"
                    title="A structured flow for real-world response"
                    headingSize="sectionHero"
                />

                {/* FLOW WRAPPER */}
                <div className="relative mt-14 md:mt-16 xl:mt-20">
                    {/* DESKTOP CONNECTOR LINE */}
                    <motion.div
                        variants={lineVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        className="
                            hidden xl:block
                            absolute left-0 right-0 top-18 h-px
                            origin-left

                            bg-linear-to-r
                            from-transparent
                            via-primary/20
                            to-transparent
                        "
                    />

                    {/* GRID */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.15 }}
                        className="
                            relative

                            grid grid-cols-1
                            md:grid-cols-2
                            xl:grid-cols-4

                            gap-6 md:gap-7 xl:gap-6
                        "
                    >
                        {flow.map((item, index) => {
                            const isStrong = item.emphasis === 'strong';
                            const isSoft = item.emphasis === 'soft';
                            const isAccent = index === 0;

                            return (
                                <motion.div
                                    key={index}
                                    variants={cardVariants}
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
                                                <div
                                                    className="
                                                        absolute inset-0
                                                        bg-primary/30
                                                        blur-sm
                                                        opacity-40

                                                        group-hover:opacity-70
                                                        transition
                                                    "
                                                />
                                            </div>

                                            <TbArrowNarrowRight
                                                size={16}
                                                className="
                                                    text-primary/40

                                                    group-hover:text-primary/80

                                                    transition-colors duration-300
                                                "
                                            />
                                        </div>
                                    )}

                                    {/* CARD */}
                                    <motion.div
                                        whileHover={{
                                            y: -4,
                                        }}
                                        transition={{
                                            duration: 0.28,
                                            ease: [0.22, 1, 0.36, 1],
                                        }}
                                        className={`
                                            relative rounded-3xl border backdrop-blur-sm

                                            p-5 sm:p-6 lg:p-8
                                            min-h-65 sm:min-h-70

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
                                        {/* STEP HEADER */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className={`
                                                        text-[11px] sm:text-xs
                                                        tracking-[0.22em]
                                                        uppercase
                                                        font-semibold

                                                        ${
                                                            isAccent
                                                                ? 'text-accent'
                                                                : 'text-primary/60'
                                                        }
                                                    `}
                                                >
                                                    Step {item.step}
                                                </span>

                                                <div className="relative">
                                                    <div
                                                        className={`
                                                            w-2.5 h-2.5 rounded-full

                                                            ${
                                                                isAccent
                                                                    ? 'bg-accent'
                                                                    : 'bg-primary'
                                                            }
                                                        `}
                                                    />

                                                    <div
                                                        className={`
                                                            absolute inset-0
                                                            rounded-full
                                                            blur-md
                                                            animate-pulse

                                                            ${
                                                                isAccent
                                                                    ? 'bg-accent/30'
                                                                    : 'bg-primary/30'
                                                            }
                                                        `}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* TITLE */}
                                        <h3
                                            className="
                                                mt-6 sm:mt-7 lg:mt-8

                                                text-[18px]
                                                sm:text-[20px]
                                                lg:text-[22px]

                                                leading-[1.18]
                                                tracking-[-0.02em]
                                                font-semibold

                                                text-text-primary
                                            "
                                        >
                                            {item.title}
                                        </h3>

                                        {/* DECOR LINE */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: 40 }}
                                            viewport={{ once: true }}
                                            transition={{
                                                duration: 0.55,
                                                delay: 0.25,
                                            }}
                                            className={`
                                                mt-3 sm:mt-4
                                                h-0.5 rounded-full

                                                ${
                                                    isAccent
                                                        ? 'bg-accent/60'
                                                        : 'bg-primary/40'
                                                }
                                            `}
                                        />

                                        {/* DESCRIPTION */}
                                        <p
                                            className="
                                                mt-4 sm:mt-5

                                                text-[14px]
                                                sm:text-[15px]

                                                leading-[1.8]

                                                text-text-secondary
                                            "
                                        >
                                            {item.desc}
                                        </p>

                                        {/* FOOTER */}
                                        {isSoft && (
                                            <div className="mt-6 sm:mt-8 text-sm font-medium text-primary/60">
                                                The challenge CareLink is
                                                solving
                                            </div>
                                        )}

                                        {isStrong && (
                                            <div className="mt-6 sm:mt-8 flex items-center gap-2 text-sm font-medium text-primary">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                Verified help delivered with
                                                clarity
                                            </div>
                                        )}
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                        duration: 0.6,
                        delay: 0.2,
                    }}
                    className="mt-12 md:mt-14 lg:mt-16 flex justify-center"
                >
                    <Link
                        to="/how-it-works"
                        className="
                            group inline-flex items-center gap-3

                            px-1 py-2 sm:px-2

                            text-sm sm:text-[15px]
                            font-medium

                            text-primary/80

                            transition-all duration-300
                        "
                    >
                        <span className="relative leading-snug">
                            <span
                                className="
                                    transition-colors duration-300
                                    group-hover:text-accent/80
                                "
                            >
                                Explore the full CareLink workflow
                            </span>

                            {/* UNDERLINE */}
                            <span
                                className="
                                    absolute left-0 -bottom-1
                                    w-full h-px

                                    bg-linear-to-r
                                    from-primary/30
                                    via-primary/15
                                    to-transparent

                                    group-hover:from-accent/60
                                    group-hover:via-accent/30

                                    transition-all duration-300
                                "
                            />
                        </span>

                        <TbArrowNarrowRight
                            size={18}
                            className="
                                text-primary/50

                                group-hover:text-accent/90
                                group-hover:translate-x-1

                                transition-all duration-300
                            "
                        />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default HowCareLinkWorks;
