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
                bg-[#20232A]
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
                    sm:pt-5
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
                                font-semibold
                                uppercase
                                tracking-[0.15em]
                                text-[#6F7785]
                            "
                        >
                            Directory controls
                        </p>

                        <h3
                            className="
                                mt-1.5
                                text-[15px]
                                font-semibold
                                leading-5
                                text-[#F1F2F4]!
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
                                inline-flex
                                shrink-0
                                items-center
                                gap-1.5

                                text-[10px]
                                font-medium
                                text-[#9299A6]

                                transition-colors

                                hover:text-[#F1F2F4]

                                focus:outline-none
                                focus:ring-0
                            "
                        >
                            <RotateCcw size={11} strokeWidth={1.8} />
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
                        text-[#7F8794]
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
                    border-[#343944]

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
                            font-semibold
                            uppercase
                            tracking-[0.14em]
                            text-[#6F7785]
                        "
                    >
                        User role
                    </p>

                    <span
                        className="
                            text-[9px]
                            font-medium
                            tabular-nums
                            text-[#6F7785]
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
                    border-[#343944]

                    px-4
                    py-4
                "
            >
                <p
                    className="
                        mb-2.5
                        px-1

                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]

                        text-[#6F7785]
                    "
                >
                    Account status
                </p>

                <div
                    className="
                        overflow-hidden

                        border
                        border-[#343944]

                        bg-[#22252D]
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
                                    border-[#2F333D]

                                    px-3
                                    py-2.5

                                    text-left

                                    transition-colors
                                    duration-150

                                    last:border-b-0

                                    ${
                                        active
                                            ? 'bg-[#303641]'
                                            : 'hover:bg-[#272B34]'
                                    }
                                `}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.8}
                                    className={`
                                        shrink-0
                                        transition-colors

                                        ${
                                            active
                                                ? 'text-[#C3C7CF]'
                                                : 'text-[#6F7785] group-hover:text-[#9299A6]'
                                        }
                                    `}
                                />

                                <span
                                    className={`
                                        min-w-0
                                        flex-1

                                        text-[11px]

                                        ${
                                            active
                                                ? 'font-semibold text-[#F1F2F4]'
                                                : 'font-medium text-[#9299A6] group-hover:text-[#C3C7CF]'
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

                                            bg-[#393F4C]

                                            text-[#C3C7CF]
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
                    border-[#343944]

                    px-4
                    py-4
                "
            >
                <p
                    className="
                        mb-2.5
                        px-1

                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.14em]

                        text-[#6F7785]
                    "
                >
                    Email verification
                </p>

                <div
                    className="
                        overflow-hidden

                        border
                        border-[#343944]

                        bg-[#22252D]
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
                                        border-[#2F333D]

                                        px-3
                                        py-2.5

                                        text-left

                                        transition-colors
                                        duration-150

                                        last:border-b-0

                                        ${
                                            active
                                                ? 'bg-[#303641]'
                                                : 'hover:bg-[#272B34]'
                                        }
                                    `}
                            >
                                <Icon
                                    size={14}
                                    strokeWidth={1.8}
                                    className={`
                                            shrink-0
                                            transition-colors

                                            ${
                                                active
                                                    ? 'text-[#C3C7CF]'
                                                    : 'text-[#6F7785] group-hover:text-[#9299A6]'
                                            }
                                        `}
                                />

                                <span
                                    className={`
                                            min-w-0
                                            flex-1

                                            text-[11px]

                                            ${
                                                active
                                                    ? 'font-semibold text-[#F1F2F4]'
                                                    : 'font-medium text-[#9299A6] group-hover:text-[#C3C7CF]'
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

                                                bg-[#393F4C]

                                                text-[#C3C7CF]
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
