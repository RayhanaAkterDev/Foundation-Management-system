import React from 'react';

import { Building2, ShieldCheck, UserRound, Users } from 'lucide-react';

/* ==========================================================================
   STAT ITEM
============================================================================ */

const StatItem = ({
    icon: Icon,
    label,
    value,
    description,
    featured = false,
}) => {
    return (
        <div
            className={`
                group
                relative
                min-w-0

                px-5
                py-5

                transition-colors
                duration-200
                ease-out

                sm:px-6
                sm:py-6

                lg:px-6
                lg:py-6

                ${
                    featured
                        ? `
                            bg-[#171E28]
                            hover:bg-[#1A222D]
                        `
                        : `
                            bg-[#0E1219]
                            hover:bg-[#1A222D]
                        `
                }
            `}
        >
            {/* =========================================================
                FEATURED EDGE
            ========================================================= */}

            {featured && (
                <span
                    aria-hidden="true"
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-px
                        bg-[#697586]
                    "
                />
            )}

            <div className="flex items-start justify-between gap-5">
                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                        <Icon
                            size={15}
                            strokeWidth={1.7}
                            className="
                                shrink-0
                                text-[#7F8A99]

                                transition-colors
                                duration-200

                                group-hover:text-[#A5AFBB]
                            "
                        />

                        <p
                            className="
                                truncate

                                font-sans!
                                text-[10px]
                                font-semibold!
                                uppercase
                                tracking-[0.13em]

                                text-[#8792A1]

                                transition-colors
                                duration-200

                                group-hover:text-[#AAB3BF]

                                sm:text-[11px]
                            "
                        >
                            {label}
                        </p>
                    </div>

                    {/* =================================================
                        VALUE
                    ================================================= */}

                    <div className="mt-5 flex items-end gap-2">
                        <span
                            className="
                                font-sans!

                                text-[28px]
                                font-semibold!
                                leading-none
                                tracking-[-0.035em]

                                text-[#EEF1F5]

                                sm:text-[31px]
                                lg:text-[34px]
                            "
                        >
                            {value}
                        </span>

                        <span
                            className="
                                pb-0.5

                                font-sans!
                                text-[10px]
                                font-medium!

                                text-[#697586]

                                sm:text-[11px]
                            "
                        >
                            {value === 1 ? 'account' : 'accounts'}
                        </span>
                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p
                        className="
                            mt-2.5
                            max-w-[230px]

                            font-sans!
                            text-[11px]
                            leading-[1.65]

                            text-[#8A95A4]

                            sm:text-[12px]
                        "
                    >
                        {description}
                    </p>
                </div>

                {/* =====================================================
                    INDEX
                ===================================================== */}

                <span
                    className="
                        shrink-0

                        font-sans!
                        text-[9px]
                        font-semibold!
                        tracking-[0.12em]

                        text-[#5F6B7A]
                    "
                >
                    {featured ? '01' : null}
                </span>
            </div>
        </div>
    );
};

/* ==========================================================================
   STATS
============================================================================ */

const Stats = ({
    total = 0,
    individuals = 0,
    organizations = 0,
    administrators = 0,
}) => {
    const metrics = [
        {
            key: 'total',
            label: 'Total Users',
            value: total,
            description: 'All registered platform accounts.',
            icon: Users,
            featured: true,
        },
        {
            key: 'individuals',
            label: 'Individuals',
            value: individuals,
            description: 'Personal member accounts.',
            icon: UserRound,
        },
        {
            key: 'organizations',
            label: 'Organizations',
            value: organizations,
            description: 'Registered organization accounts.',
            icon: Building2,
        },
        {
            key: 'administrators',
            label: 'Administrators',
            value: administrators,
            description: 'Accounts with administrative access.',
            icon: ShieldCheck,
        },
    ];

    return (
        <section aria-labelledby="user-overview-heading" className="pt-1">
            {/* =========================================================
                SECTION HEADER
            ========================================================= */}

            <div
                className="
                    mb-5

                    flex
                    items-end
                    justify-between
                    gap-6

                    sm:mb-6
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            font-sans!

                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.16em]

                            text-[#697586]
                        "
                    >
                        Account overview
                    </p>

                    <h2
                        id="user-overview-heading"
                        className="
                            mt-1.5

                            font-sans!

                            text-[16px]
                            font-semibold!
                            leading-[1.35]
                            tracking-[-0.015em]

                            text-[#EEF1F5]!

                            sm:text-[17px]
                        "
                    >
                        Platform users
                    </h2>
                </div>

                <div
                    className="
                        hidden
                        items-center
                        gap-2.5

                        sm:flex
                    "
                >
                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-[#7C8795]
                        "
                    />

                    <span
                        className="
                            font-sans!

                            text-[10px]
                            font-medium!

                            text-[#8792A1]
                        "
                    >
                        {total} registered
                    </span>
                </div>
            </div>

            {/* =========================================================
                STAT GRID
            ========================================================= */}

            <div
                className="
                    grid
                    grid-cols-2

                    overflow-hidden

                    border
                    border-[#252D38]

                    bg-[#0E1219]

                    lg:grid-cols-4
                "
            >
                {metrics.map((metric, index) => (
                    <div
                        key={metric.key}
                        className={`
                            min-w-0

                            ${
                                index % 2 !== 0
                                    ? 'border-l border-[#252D38]'
                                    : ''
                            }

                            ${index >= 2 ? 'border-t border-[#252D38]' : ''}

                            lg:border-t-0

                            ${
                                index > 0
                                    ? `
                                        lg:border-l
                                        lg:border-[#252D38]
                                    `
                                    : 'lg:border-l-0'
                            }
                        `}
                    >
                        <StatItem
                            icon={metric.icon}
                            label={metric.label}
                            value={metric.value}
                            description={metric.description}
                            featured={metric.featured}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
