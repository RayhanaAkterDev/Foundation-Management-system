import React from 'react';

import {
    Check,
    CircleCheck,
    CircleMinus,
    ShieldAlert,
    MailCheck,
    MailWarning,
    Mail,
    RotateCcw,
} from 'lucide-react';

import UserCategoryTabs from './CategoryTabs';

const Filters = ({
    categoryTabs = [],
    activeCategory,
    onCategoryChange,

    statusFilter,
    onStatusChange,

    verificationFilter,
    onVerificationChange,

    activeFilterCount = 0,
    onClearFilters,
}) => {
    const statuses = [
        {
            value: 'all',
            label: 'All accounts',
            icon: CircleCheck,
        },
        {
            value: 'active',
            label: 'Active',
            icon: CircleCheck,
        },
        {
            value: 'inactive',
            label: 'Inactive',
            icon: CircleMinus,
        },
        {
            value: 'suspended',
            label: 'Suspended',
            icon: ShieldAlert,
        },
    ];

    const verificationStatuses = [
        {
            value: 'all',
            label: 'All emails',
            icon: Mail,
        },
        {
            value: 'verified',
            label: 'Verified',
            icon: MailCheck,
        },
        {
            value: 'unverified',
            label: 'Unverified',
            icon: MailWarning,
        },
    ];

    return (
        <div
            className="
                w-full
                bg-[#0E1219]
            "
        >
            {/* =========================================================
                FILTER HEADER
            ========================================================= */}

            <div
                className="
                    px-4
                    pb-4
                    pt-4

                    sm:px-5
                    sm:pb-5
                    sm:pt-5 bg-[#1A222D]
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >
                    <div className="min-w-0">
                        <p
                            className="
                                text-[9px]
                                font-semibold!
                                uppercase
                                tracking-[0.15em]

                                text-[#697586]
                            "
                        >
                            Directory controls
                        </p>

                        <h3
                            className="
                                mt-1.5

                                text-[15px]
                                font-semibold!
                                leading-5

                                text-[#EEF1F5]!
                            "
                        >
                            Filter users
                        </h3>
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={onClearFilters}
                            className="
                                group

                                inline-flex
                                shrink-0
                                items-center
                                gap-1.5

                                text-[10px]
                                font-medium!

                                text-[#8792A1]

                                transition-colors
                                duration-150

                                hover:text-[#EEF1F5]

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <RotateCcw
                                size={11}
                                strokeWidth={1.8}
                                className="
                                    transition-transform
                                    duration-200

                                    group-hover:-rotate-45
                                "
                            />
                            Clear all
                        </button>
                    )}
                </div>

                <p
                    className="
                        mt-2
                        max-w-[280px]

                        text-[11px]
                        leading-5

                        text-[#7F8A99]
                    "
                >
                    Refine the directory by role, account status and
                    verification.
                </p>
            </div>

            {/* =========================================================
                USER ROLE
            ========================================================= */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    px-4
                    py-4
                "
            >
                <div
                    className="
                        mb-2.5

                        flex
                        items-center
                        justify-between

                        px-1
                    "
                >
                    <p
                        className="
                            text-[9px]
                            font-semibold!
                            uppercase
                            tracking-[0.14em]

                            text-[#697586]
                        "
                    >
                        User role
                    </p>

                    <span
                        className="
                            text-[9px]
                            font-medium!
                            tabular-nums

                            text-[#5E6978]
                        "
                    >
                        {categoryTabs.length}
                    </span>
                </div>

                <UserCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={onCategoryChange}
                />
            </div>

            {/* =========================================================
                ACCOUNT STATUS
            ========================================================= */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    px-4
                    py-4
                "
            >
                <p
                    className="
                        mb-2.5
                        px-1

                        text-[9px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]

                        text-[#697586]
                    "
                >
                    Account status
                </p>

                <div
                    className="
                        overflow-hidden

                        border
                        border-[#252D38]

                        bg-[#0E1219]
                    "
                >
                    {statuses.map((status) => {
                        const active = statusFilter === status.value;
                        const Icon = status.icon;

                        return (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() =>
                                    onStatusChange({
                                        target: {
                                            value: status.value,
                                        },
                                    })
                                }
                                className={`
                                    group

                                    flex
                                    min-h-10
                                    w-full
                                    items-center
                                    gap-2.5

                                    border-b
                                    border-[#202832]

                                    px-3
                                    py-2.5

                                    text-left

                                    transition-[background-color,color]
                                    duration-150
                                    ease-out

                                    last:border-b-0

                                    ${
                                        active
                                            ? 'bg-[#171E28]'
                                            : 'bg-[#0E1219] hover:bg-[#151B24]'
                                    }

                                    focus:outline-none
                                    focus:ring-0
                                `}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.8}
                                    className={`
                                        shrink-0

                                        transition-colors
                                        duration-150

                                        ${
                                            active
                                                ? 'text-[#B8C0CA]'
                                                : `
                                                    text-[#657181]

                                                    group-hover:text-[#AEB7C3]
                                                `
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        min-w-0
                                        flex-1

                                        text-[11px]

                                        transition-colors
                                        duration-150

                                        ${
                                            active
                                                ? `
                                                    font-semibold!
                                                    text-[#EEF1F5]
                                                `
                                                : `
                                                    font-medium!
                                                    text-[#8792A1]

                                                    group-hover:text-[#B8C0CA]
                                                `
                                        }
                                    `}
                                >
                                    {status.label}
                                </span>

                                {active && (
                                    <span
                                        className="
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center

                                            border
                                            border-[#394555]

                                            bg-[#1D2632]

                                            text-[#B8C0CA]
                                        "
                                    >
                                        <Check size={11} strokeWidth={2.2} />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* =========================================================
                EMAIL VERIFICATION
            ========================================================= */}

            <div
                className="
                    border-t
                    border-[#252D38]

                    px-4
                    py-4
                "
            >
                <p
                    className="
                        mb-2.5
                        px-1

                        text-[9px]
                        font-semibold!
                        uppercase
                        tracking-[0.14em]

                        text-[#697586]
                    "
                >
                    Email verification
                </p>

                <div
                    className="
                        overflow-hidden

                        border
                        border-[#252D38]

                        bg-[#0E1219]
                    "
                >
                    {verificationStatuses.map((status) => {
                        const active = verificationFilter === status.value;

                        const Icon = status.icon;

                        return (
                            <button
                                key={status.value}
                                type="button"
                                onClick={() =>
                                    onVerificationChange({
                                        target: {
                                            value: status.value,
                                        },
                                    })
                                }
                                className={`
                                    group

                                    flex
                                    min-h-10
                                    w-full
                                    items-center
                                    gap-2.5

                                    border-b
                                    border-[#202832]

                                    px-3
                                    py-2.5

                                    text-left

                                    transition-[background-color,color]
                                    duration-150
                                    ease-out

                                    last:border-b-0

                                    ${
                                        active
                                            ? 'bg-[#171E28]'
                                            : 'bg-[#0E1219] hover:bg-[#151B24]'
                                    }

                                    focus:outline-none
                                    focus:ring-0
                                `}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.8}
                                    className={`
                                        shrink-0

                                        transition-colors
                                        duration-150

                                        ${
                                            active
                                                ? 'text-[#B8C0CA]'
                                                : `
                                                    text-[#657181]

                                                    group-hover:text-[#AEB7C3]
                                                `
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        min-w-0
                                        flex-1

                                        text-[11px]

                                        transition-colors
                                        duration-150

                                        ${
                                            active
                                                ? `
                                                    font-semibold!
                                                    text-[#EEF1F5]
                                                `
                                                : `
                                                    font-medium!
                                                    text-[#8792A1]

                                                    group-hover:text-[#B8C0CA]
                                                `
                                        }
                                    `}
                                >
                                    {status.label}
                                </span>

                                {active && (
                                    <span
                                        className="
                                            flex
                                            h-5
                                            w-5
                                            shrink-0
                                            items-center
                                            justify-center

                                            border
                                            border-[#394555]

                                            bg-[#1D2632]

                                            text-[#B8C0CA]
                                        "
                                    >
                                        <Check size={11} strokeWidth={2.2} />
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Filters;
