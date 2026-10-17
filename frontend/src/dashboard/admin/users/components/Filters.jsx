import React from 'react';

import {
    Check,
    CircleCheck,
    CircleMinus,
    ShieldAlert,
    Mail,
    MailCheck,
    MailWarning,
    RotateCcw,
} from 'lucide-react';

import UserCategoryTabs from './CategoryTabs';

/* ==========================================================================
   SECONDARY FILTER OPTION
============================================================================ */

const FilterOption = ({ label, icon: Icon, active, onClick }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`
                group
                flex
                min-h-9.5
                w-full
                items-center
                gap-2.5
                px-3
                py-2
                text-left
                transition-colors
                duration-150
                focus-visible:outline
                focus-visible:outline-1
                focus-visible:outline-[#697586]
                ${active ? 'bg-[#1A222D]' : 'bg-transparent hover:bg-[#151B24]'}
            `}
        >
            {/* OPTION ICON */}

            <Icon
                size={14}
                strokeWidth={1.75}
                className={`
                    shrink-0
                    transition-colors
                    duration-150
                    ${
                        active
                            ? 'text-[#C2CBD6]'
                            : 'text-[#697586] group-hover:text-[#AEB7C3]'
                    }
                `}
            />

            {/* OPTION LABEL */}

            <span
                className={`
                    min-w-0
                    flex-1
                    truncate
                    text-[11px]
                    leading-5
                    ${
                        active
                            ? 'font-semibold! text-[#EEF1F5]'
                            : 'font-medium! text-[#8792A1] group-hover:text-[#B8C0CA]'
                    }
                `}
            >
                {label}
            </span>

            {/* SELECTION INDICATOR */}

            <span
                aria-hidden="true"
                className={`
                    flex
                    h-3.5
                    w-3.5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    transition-colors
                    duration-150
                    ${
                        active
                            ? 'border-[#8493A6] bg-[#8493A6]'
                            : 'border-[#455160] bg-transparent group-hover:border-[#697586]'
                    }
                `}
            >
                {active && (
                    <Check
                        size={9}
                        strokeWidth={2.5}
                        className="text-[#0E1219]"
                    />
                )}
            </span>
        </button>
    );
};

/* ==========================================================================
   FILTER SECTION
============================================================================ */

const FilterSection = ({ title, children, compact = false }) => {
    return (
        <section
            className={`
                border-t
                border-[#252D38]
                px-4
                ${compact ? 'py-3.5' : 'py-4'}
            `}
        >
            <h4
                className={`
                    px-1
                    text-[10px]
                    font-semibold!
                    uppercase
                    tracking-normal
                    text-[#697586]!
                    ${compact ? 'mb-2' : 'mb-3'}
                `}
            >
                {title}
            </h4>

            <div className={compact ? 'space-y-0.5' : ''}>{children}</div>
        </section>
    );
};

/* ==========================================================================
   FILTER OPTIONS
============================================================================ */

const STATUS_OPTIONS = [
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

const VERIFICATION_OPTIONS = [
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

/* ==========================================================================
   FILTERS
============================================================================ */

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
    return (
        <div className="w-full bg-[#0E1219]">
            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="bg-[#1A222D] p-4 sm:p-5.5">
                <div className="flex items-center justify-between gap-4">
                    <h3
                        className="
                            text-[15px]
                            font-semibold!
                            leading-8
                            text-[#EEF1F5]!
                        "
                    >
                        Filter
                    </h3>

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
                                focus-visible:outline
                                focus-visible:outline-1
                                focus-visible:outline-[#697586]
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
            </div>

            {/* =========================================================
                USER ROLE — UNCHANGED
            ========================================================= */}

            <FilterSection title="User role">
                <UserCategoryTabs
                    tabs={categoryTabs}
                    activeCategory={activeCategory}
                    onChange={onCategoryChange}
                />
            </FilterSection>

            {/* =========================================================
                ACCOUNT STATUS
            ========================================================= */}

            <FilterSection title="Account status" compact>
                {STATUS_OPTIONS.map((option) => (
                    <FilterOption
                        key={option.value}
                        label={option.label}
                        icon={option.icon}
                        active={statusFilter === option.value}
                        onClick={() =>
                            onStatusChange({
                                target: {
                                    value: option.value,
                                },
                            })
                        }
                    />
                ))}
            </FilterSection>

            {/* =========================================================
                EMAIL VERIFICATION
            ========================================================= */}

            <FilterSection title="Email verification" compact>
                {VERIFICATION_OPTIONS.map((option) => (
                    <FilterOption
                        key={option.value}
                        label={option.label}
                        icon={option.icon}
                        active={verificationFilter === option.value}
                        onClick={() =>
                            onVerificationChange({
                                target: {
                                    value: option.value,
                                },
                            })
                        }
                    />
                ))}
            </FilterSection>
        </div>
    );
};

export default Filters;
