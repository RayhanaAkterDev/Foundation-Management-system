import React from 'react';
import { Building2, ShieldCheck, UserRound, Users } from 'lucide-react';

// ============================================================
// STAT ITEM
// ============================================================

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
                px-4
                py-4

                sm:px-5
                sm:py-5

                lg:px-6
                lg:py-5

                ${featured ? 'bg-[#272B34]' : 'bg-[#22252D]'}
            `}
        >
            {/* subtle active edge */}

            {featured && (
                <span
                    aria-hidden="true"
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-px
                        bg-[#9299A6]
                    "
                />
            )}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                {/* Content */}

                <div className="min-w-0">
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <Icon
                            size={15}
                            strokeWidth={1.7}
                            className="
                                shrink-0
                                text-[#969EAC]
                            "
                        />

                        <p
                            className="
                                truncate
                                text-[10px]
                                font-semibold
                                uppercase
                                tracking-[0.13em]
                                text-[#9299A6]

                                sm:text-[11px]
                            "
                        >
                            {label}
                        </p>
                    </div>

                    <div
                        className="
                            mt-4
                            flex
                            items-end
                            gap-2
                        "
                    >
                        <span
                            className="
                                font-[Poppins]
                                text-[28px]
                                font-semibold
                                leading-none
                                tracking-[-0.035em]
                                text-[#F1F2F4]

                                sm:text-[31px]
                                lg:text-[34px]
                            "
                        >
                            {value}
                        </span>

                        <span
                            className="
                                pb-0.5
                                text-[10px]
                                font-medium
                                text-[#6F7785]

                                sm:text-[11px]
                            "
                        >
                            {value === 1 ? 'account' : 'accounts'}
                        </span>
                    </div>

                    <p
                        className="
                            mt-2
                            max-w-[220px]
                            text-[11px]
                            leading-[1.55]
                            text-[#9299A6]

                            sm:text-[12px]
                        "
                    >
                        {description}
                    </p>
                </div>

                {/* Index */}

                <span
                    className="
                        shrink-0
                        font-[Poppins]
                        text-[9px]
                        font-semibold
                        tracking-[0.12em]
                        text-[#6F7785]
                    "
                >
                    {featured ? '01' : null}
                </span>
            </div>
        </div>
    );
};

// ============================================================
// STATS
// ============================================================

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
        <section aria-labelledby="user-overview-heading" className="pt-2">
            {/* ========================================================
                SECTION HEADER
            ======================================================== */}

            <div
                className="
                    mb-3
                    flex
                    items-end
                    justify-between
                    gap-4

                    sm:mb-4
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-[#6F7785]
                        "
                    >
                        Account overview
                    </p>

                    <h2
                        id="user-overview-heading"
                        className="
                            mt-1
                            text-[15px]
                            font-semibold
                            leading-tight
                            text-[#F1F2F4]

                            sm:text-[16px]
                        "
                    >
                        Platform users
                    </h2>
                </div>

                <div
                    className="
                        hidden
                        items-center
                        gap-2
                        sm:flex
                    "
                >
                    <span
                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-[#9299A6]
                        "
                    />

                    <span
                        className="
                            text-[10px]
                            font-medium
                            text-[#9299A6]
                        "
                    >
                        {total} registered
                    </span>
                </div>
            </div>

            {/* ========================================================
                STAT GRID
            ======================================================== */}

            <div
                className="
                    overflow-hidden
                    border
                    border-[#343944]
                    bg-[#22252D]

                    grid
                    grid-cols-2

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
                                    ? 'border-l border-[#343944]'
                                    : ''
                            }

                            ${index >= 2 ? 'border-t border-[#343944]' : ''}

                            lg:border-t-0

                            ${
                                index > 0
                                    ? 'lg:border-l lg:border-[#343944]'
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
