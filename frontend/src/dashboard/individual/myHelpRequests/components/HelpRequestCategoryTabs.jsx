import React from 'react';

import {
    ClipboardList,
    Clock3,
    BadgeCheck,
    CircleX,
    CircleCheck,
    Activity,
    ListChecks,
    Building2,
} from 'lucide-react';

/* ==========================================================================
   CATEGORY TABS
============================================================================ */

const CATEGORY_ICONS = {
    all: ClipboardList,
    pending: Clock3,
    verified: BadgeCheck,
    rejected: CircleX,
    completed: CircleCheck,
    assigned: Building2,
    in_progress: Activity,
    active: Activity,
};

const getCategoryIcon = (value) => {
    const normalized = String(value || '').toLowerCase();

    return CATEGORY_ICONS[normalized] || ListChecks;
};

const CategoryTabs = ({ tabs = [], activeCategory, onChange }) => {
    return (
        <div className="w-full space-y-1">
            {tabs.map((tab) => {
                const value = tab.value ?? tab.key ?? tab.id;

                const label = tab.label ?? tab.name ?? value;

                const count = tab.count;

                const active = activeCategory === value;

                const Icon = getCategoryIcon(value);

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => onChange(value)}
                        aria-pressed={active}
                        className={`
                            group relative flex min-h-10 w-full
                            items-center gap-3
                            px-3 py-2.5
                            text-left
                            transition-[background-color,color]
                            duration-150 ease-out
                            focus:outline-none
                            focus:ring-0
                            ${
                                active
                                    ? 'bg-[#171E28]'
                                    : 'bg-transparent hover:bg-[#151B24]'
                            }
                        `}
                    >
                        {/* ACTIVE INDICATOR */}

                        {active && (
                            <span
                                aria-hidden="true"
                                className="
                                    absolute inset-y-0 left-0
                                    w-0.5 bg-[#718096]
                                "
                            />
                        )}

                        {/* CATEGORY ICON */}

                        <Icon
                            size={15}
                            strokeWidth={1.8}
                            className={`
                                shrink-0
                                transition-colors duration-150
                                ${
                                    active
                                        ? 'text-[#C2CBD6]'
                                        : `
                                            text-[#657181]
                                            group-hover:text-[#AEB7C3]
                                        `
                                }
                            `}
                        />

                        {/* CATEGORY NAME */}

                        <span
                            className={`
                                min-w-0 flex-1
                                truncate text-[12px]
                                transition-colors duration-150
                                ${
                                    active
                                        ? 'font-semibold! text-[#EEF1F5]'
                                        : `
                                            font-medium! text-[#8792A1]
                                            group-hover:text-[#B8C0CA]
                                        `
                                }
                            `}
                        >
                            {label}
                        </span>

                        {/* CATEGORY COUNT */}

                        {count !== undefined && count !== null && (
                            <span
                                className={`
                                    shrink-0
                                    text-[10px]
                                    tabular-nums
                                    ${
                                        active
                                            ? 'font-semibold! text-[#B8C0CA]'
                                            : 'font-medium! text-[#697586]'
                                    }
                                `}
                            >
                                {count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryTabs;
