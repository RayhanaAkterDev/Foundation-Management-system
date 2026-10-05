import React from 'react';

import {
    Building2,
    BadgeCheck,
    Clock3,
    XCircle,
    ArrowUpRight,
    ChevronRight,
} from 'lucide-react';

// ============================================================
// STATS
// ============================================================

const Stats = ({ total, verified, pending, rejected }) => {
    const totalCount = Number(total) || 0;
    const verifiedCount = Number(verified) || 0;
    const pendingCount = Number(pending) || 0;
    const rejectedCount = Number(rejected) || 0;

    const getPercentage = (value) => {
        if (!totalCount) return 0;
        return Math.round((value / totalCount) * 100);
    };

    const verifiedPercentage = getPercentage(verifiedCount);
    const pendingPercentage = getPercentage(pendingCount);
    const rejectedPercentage = getPercentage(rejectedCount);

    const compactMetrics = [
        {
            key: 'total',
            label: 'Total registered',
            value: totalCount,
            description: 'All organizations',
            icon: Building2,
            iconClass: 'text-[#98A3B2]',
            dotClass: 'bg-[#788493]',
            featured: true,
        },
        {
            key: 'verified',
            label: 'Verified',
            value: verifiedCount,
            description: `${verifiedPercentage}% of directory`,
            icon: BadgeCheck,
            iconClass: 'text-[#48C99A]',
            dotClass: 'bg-[#48C99A]',
        },
        {
            key: 'pending',
            label: 'Pending review',
            value: pendingCount,
            description: `${pendingPercentage}% awaiting review`,
            icon: Clock3,
            iconClass: 'text-[#E6B94F]',
            dotClass: 'bg-[#E6B94F]',
        },
        {
            key: 'rejected',
            label: 'Rejected',
            value: rejectedCount,
            description: `${rejectedPercentage}% of directory`,
            icon: XCircle,
            iconClass: 'text-[#8995A5]',
            dotClass: 'bg-[#788493]',
        },
    ];

    return (
        <section
            aria-labelledby="organization-overview-heading"
            className="w-full min-w-0 pt-1"
        >
            {/* ============================================================
                SECTION HEADING
            ============================================================ */}

            <div
                className="
                    mb-5
                    flex
                    min-w-0
                    items-end
                    justify-between
                    gap-4

                    sm:mb-6
                    sm:gap-6
                "
            >
                <div className="min-w-0">
                    <p
                        className="
                            font-sans!
                            text-[10px]
                            font-semibold!
                            uppercase
                            tracking-[0.13em]
                            text-[#758192]
                        "
                    >
                        Organization overview
                    </p>

                    <h2
                        id="organization-overview-heading"
                        className="
                            mt-1.5
                            font-sans!
                            text-[17px]
                            font-semibold!
                            leading-[1.35]
                            tracking-[-0.015em]
                            text-[#F0F2F5]!

                            sm:text-[18px]
                        "
                    >
                        Platform organizations
                    </h2>
                </div>

                <div
                    className="
                        hidden
                        shrink-0
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
                            bg-[#84909F]
                        "
                    />

                    <span
                        className="
                            font-sans!
                            text-[11px]
                            font-medium!
                            text-[#8D98A7]
                        "
                    >
                        {totalCount} registered
                    </span>
                </div>
            </div>

            {/* ============================================================
                MOBILE / TABLET / SMALL LAPTOP

                Keep this compact layout active through lg.
                The full analytical layout begins at xl so it does not
                become compressed when the dashboard sidebar is open.
            ============================================================ */}

            <div
                className="
                    grid
                    min-w-0
                    grid-cols-2
                    overflow-hidden

                    border
                    border-[#252D38]

                    bg-[#10151D]

                    xl:hidden
                "
            >
                {compactMetrics.map((metric, index) => {
                    const Icon = metric.icon;

                    return (
                        <div
                            key={metric.key}
                            className={`
                                group
                                relative
                                min-w-0

                                px-3.5
                                py-4

                                transition-colors
                                duration-150
                                ease-out

                                hover:bg-[#181F29]

                                sm:px-5
                                sm:py-5

                                md:px-6

                                ${
                                    metric.featured
                                        ? 'bg-[#161D26]'
                                        : 'bg-[#10151D]'
                                }

                                ${
                                    index % 2 !== 0
                                        ? 'border-l border-[#252D38]'
                                        : ''
                                }

                                ${index >= 2 ? 'border-t border-[#252D38]' : ''}
                            `}
                        >
                            {metric.featured && (
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

                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-center
                                    gap-2
                                "
                            >
                                <Icon
                                    size={15}
                                    strokeWidth={1.8}
                                    className={`
                                        shrink-0
                                        ${metric.iconClass}
                                    `}
                                />

                                <p
                                    className="
                                        min-w-0
                                        truncate

                                        font-sans!
                                        text-[10px]
                                        font-semibold!
                                        uppercase
                                        tracking-[0.07em]

                                        text-[#909BAA]

                                        sm:text-[11px]
                                    "
                                >
                                    {metric.label}
                                </p>
                            </div>

                            <div
                                className="
                                    mt-4
                                    flex
                                    min-w-0
                                    items-end
                                    gap-2
                                "
                            >
                                <span
                                    className="
                                        font-sans!
                                        text-[27px]
                                        font-semibold!
                                        leading-none
                                        tracking-[-0.035em]
                                        text-[#F0F2F5]

                                        sm:text-[31px]
                                    "
                                >
                                    {metric.value}
                                </span>

                                <span
                                    className={`
                                        mb-1
                                        h-1.5
                                        w-1.5
                                        shrink-0
                                        rounded-full
                                        ${metric.dotClass}
                                    `}
                                />
                            </div>

                            <p
                                className="
                                    mt-2
                                    truncate

                                    font-sans!
                                    text-[10px]
                                    leading-[1.5]

                                    text-[#7F8A99]

                                    sm:text-[11px]
                                "
                            >
                                {metric.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* ============================================================
                LARGE DESKTOP

                Full organization-specific analytical composition.
                Starts at xl instead of lg so it has enough horizontal
                space even while the dashboard sidebar is open.
            ============================================================ */}

            <div
                className="
                    hidden
                    min-w-0
                    overflow-hidden

                    border
                    border-[#252D38]

                    bg-[#10151D]

                    xl:grid
                    xl:grid-cols-[minmax(210px,0.82fr)_minmax(390px,1.48fr)_minmax(220px,0.72fr)]
                "
            >
                {/* ========================================================
                    TOTAL
                ======================================================== */}

                <div
                    className="
                        relative
                        flex
                        min-h-[245px]
                        min-w-0
                        flex-col
                        justify-between
                        overflow-hidden

                        border-r
                        border-[#252D38]

                        bg-[#151B24]

                        px-7
                        py-6
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-18
                            -right-18

                            h-38
                            w-38
                            rounded-full

                            border-[20px]
                            border-[#718096]/[0.035]
                        "
                    />

                    <div
                        className="
                            relative
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >
                        <span
                            className="
                                font-sans!
                                text-[10px]
                                font-semibold!
                                uppercase
                                tracking-[0.11em]
                                text-[#8290A1]
                            "
                        >
                            Total registered
                        </span>

                        <ArrowUpRight
                            size={15}
                            strokeWidth={1.7}
                            className="shrink-0 text-[#697586]"
                        />
                    </div>

                    <div className="relative">
                        <div
                            className="
                                flex
                                flex-wrap
                                items-baseline
                                gap-x-2.5
                                gap-y-1
                            "
                        >
                            <span
                                className="
                                    font-sans!
                                    text-[48px]
                                    font-semibold!
                                    leading-none
                                    tracking-[-0.05em]
                                    text-[#F1F3F6]
                                "
                            >
                                {totalCount}
                            </span>

                            <span
                                className="
                                    font-sans!
                                    text-[11px]
                                    font-medium!
                                    text-[#84909F]
                                "
                            >
                                organizations
                            </span>
                        </div>

                        <div
                            className="
                                mt-4
                                flex
                                flex-wrap
                                items-center
                                gap-2.5
                            "
                        >
                            <span
                                className="
                                    inline-flex
                                    min-h-6
                                    items-center

                                    bg-[#15372E]

                                    px-2.5
                                    py-1

                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    text-[#62D6AC]
                                "
                            >
                                {verifiedPercentage}% verified
                            </span>

                            <span
                                className="
                                    font-sans!
                                    text-[10px]
                                    text-[#738091]
                                "
                            >
                                across the platform
                            </span>
                        </div>
                    </div>
                </div>

                {/* ========================================================
                    VERIFICATION
                ======================================================== */}

                <div
                    className="
                        min-w-0

                        border-r
                        border-[#252D38]

                        bg-[#0F141C]

                        px-8
                        py-6
                    "
                >
                    <div
                        className="
                            flex
                            min-w-0
                            items-start
                            justify-between
                            gap-4
                        "
                    >
                        <div className="min-w-0">
                            <p
                                className="
                                    font-sans!
                                    text-[10px]
                                    font-semibold!
                                    uppercase
                                    tracking-[0.11em]
                                    text-[#8290A1]
                                "
                            >
                                Verification status
                            </p>

                            <p
                                className="
                                    mt-1.5
                                    truncate
                                    font-sans!
                                    text-[11px]
                                    text-[#728092]
                                "
                            >
                                Current organization distribution
                            </p>
                        </div>

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center

                                bg-[#19212C]

                                text-[#8B97A7]
                            "
                        >
                            <BadgeCheck size={16} strokeWidth={1.7} />
                        </div>
                    </div>

                    {/* Distribution */}

                    <div className="mt-7">
                        <div
                            className="
                                flex
                                h-2
                                overflow-hidden
                                bg-[#1D2530]
                            "
                        >
                            {verifiedPercentage > 0 && (
                                <div
                                    className="
                                        min-w-0
                                        bg-[#39B98A]
                                        transition-[width]
                                        duration-500
                                    "
                                    style={{
                                        width: `${verifiedPercentage}%`,
                                    }}
                                />
                            )}

                            {pendingPercentage > 0 && (
                                <div
                                    className="
                                        min-w-0
                                        bg-[#DDAE3E]
                                        transition-[width]
                                        duration-500
                                    "
                                    style={{
                                        width: `${pendingPercentage}%`,
                                    }}
                                />
                            )}

                            {rejectedPercentage > 0 && (
                                <div
                                    className="
                                        min-w-0
                                        bg-[#687586]
                                        transition-[width]
                                        duration-500
                                    "
                                    style={{
                                        width: `${rejectedPercentage}%`,
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Status rows */}

                    <div
                        className="
                            mt-5
                            divide-y
                            divide-[#252D38]
                        "
                    >
                        <StatusRow
                            label="Verified"
                            value={verifiedCount}
                            percentage={verifiedPercentage}
                            icon={BadgeCheck}
                            iconClass="text-[#45C697]"
                            dotClass="bg-[#45C697]"
                        />

                        <StatusRow
                            label="Pending review"
                            value={pendingCount}
                            percentage={pendingPercentage}
                            icon={Clock3}
                            iconClass="text-[#E0B34A]"
                            dotClass="bg-[#E0B34A]"
                        />

                        <StatusRow
                            label="Rejected"
                            value={rejectedCount}
                            percentage={rejectedPercentage}
                            icon={XCircle}
                            iconClass="text-[#84909F]"
                            dotClass="bg-[#697586]"
                        />
                    </div>
                </div>

                {/* ========================================================
                    REVIEW QUEUE
                ======================================================== */}

                <div
                    className="
                        flex
                        min-h-[245px]
                        min-w-0
                        flex-col

                        bg-[#151B24]

                        px-7
                        py-6
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                font-sans!
                                text-[10px]
                                font-semibold!
                                uppercase
                                tracking-[0.11em]
                                text-[#8290A1]
                            "
                        >
                            Review queue
                        </p>

                        <div
                            className="
                                mt-4
                                flex
                                min-w-0
                                flex-wrap
                                items-end
                                gap-x-2.5
                                gap-y-1
                            "
                        >
                            <span
                                className="
                                    font-sans!
                                    text-[43px]
                                    font-semibold!
                                    leading-none
                                    tracking-[-0.045em]
                                    text-[#F1F3F6]
                                "
                            >
                                {pendingCount}
                            </span>

                            <span
                                className="
                                    mb-1
                                    font-sans!
                                    text-[10px]
                                    font-medium!
                                    text-[#8290A1]
                                "
                            >
                                awaiting review
                            </span>
                        </div>

                        <div
                            className="
                                mt-5
                                flex
                                min-w-0
                                items-start
                                gap-3
                            "
                        >
                            <span
                                className="
                                    mt-0.5
                                    h-7
                                    w-[3px]
                                    shrink-0
                                    bg-[#DDAE3E]
                                "
                            />

                            <p
                                className="
                                    min-w-0
                                    max-w-[210px]

                                    font-sans!
                                    text-[10px]
                                    leading-[1.65]

                                    text-[#7C8999]
                                "
                            >
                                Organizations requiring verification before
                                becoming trusted.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="
                            group
                            mt-auto

                            flex
                            w-full
                            min-w-0
                            items-center
                            justify-between
                            gap-3

                            border-t
                            border-[#2A333F]

                            pt-4

                            text-left
                        "
                    >
                        <span
                            className="
                                min-w-0
                                truncate

                                font-sans!
                                text-[10px]
                                font-semibold!
                                text-[#AEB7C3]

                                transition-colors
                                duration-150

                                group-hover:text-[#EEF1F5]
                            "
                        >
                            Open review queue
                        </span>

                        <span
                            className="
                                flex
                                h-8
                                w-8
                                shrink-0
                                items-center
                                justify-center

                                bg-[#1B2430]
                                text-[#84909F]

                                transition-colors
                                duration-150

                                group-hover:bg-[#252F3B]
                                group-hover:text-[#EEF1F5]
                            "
                        >
                            <ChevronRight size={14} strokeWidth={2} />
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
};

// ============================================================
// STATUS ROW
// ============================================================

const StatusRow = ({
    label,
    value,
    percentage,
    icon: Icon,
    iconClass,
    dotClass,
}) => {
    return (
        <div
            className="
                flex
                min-w-0
                items-center
                justify-between
                gap-4
                py-3.5
            "
        >
            <div
                className="
                    flex
                    min-w-0
                    items-center
                    gap-3
                "
            >
                <Icon
                    size={14}
                    strokeWidth={1.8}
                    className={`shrink-0 ${iconClass}`}
                />

                <span
                    className="
                        truncate

                        font-sans!
                        text-[11px]
                        font-semibold!

                        text-[#C3CAD3]
                    "
                >
                    {label}
                </span>
            </div>

            <div
                className="
                    flex
                    shrink-0
                    items-center
                    gap-4
                "
            >
                <span
                    className="
                        min-w-8
                        text-right

                        font-sans!
                        text-[10px]
                        font-medium!

                        text-[#788596]
                    "
                >
                    {percentage}%
                </span>

                <div
                    className="
                        flex
                        min-w-10
                        items-center
                        justify-end
                        gap-2
                    "
                >
                    <span
                        className={`
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            ${dotClass}
                        `}
                    />

                    <span
                        className="
                            font-sans!
                            text-[11px]
                            font-semibold!
                            text-[#EEF1F5]
                        "
                    >
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Stats;
