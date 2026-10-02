import React from 'react';

import { ArrowUpRight } from 'lucide-react';

/* ==========================================================================
   QUICK ACTIONS
============================================================================ */

const QuickActions = ({ actions = [], title = 'Quick Actions' }) => {
    return (
        <section
            className="
                overflow-hidden

                border
                border-[#343944]

                bg-[#22252D]
            "
        >
            {/* =============================================================
                HEADER
            ============================================================= */}

            {title && (
                <header
                    className="
                        flex
                        min-h-12
                        items-center

                        border-b
                        border-[#343944]

                        bg-[#20232A]

                        px-4

                        sm:px-5
                    "
                >
                    <h2
                        className="
                            font-sans!

                            text-[12px]
                            font-semibold

                            text-[#E5E7EB]!
                        "
                    >
                        {title}
                    </h2>
                </header>
            )}

            {/* =============================================================
                ACTIONS
            ============================================================= */}

            <div
                className="
                    divide-y
                    divide-[#2F333D]
                "
            >
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    const primary = action.variant === 'primary';

                    return (
                        <button
                            key={action.id ?? action.key ?? index}
                            type="button"
                            onClick={action.onClick}
                            className={`
                                    group

                                    flex
                                    min-h-[58px]
                                    w-full
                                    items-center
                                    gap-3

                                    px-4

                                    text-left

                                    transition-colors
                                    duration-150

                                    sm:px-5

                                    ${
                                        primary
                                            ? 'bg-[#272B34]'
                                            : 'bg-transparent'
                                    }

                                    hover:bg-[#2C303A]

                                    focus:outline-none
                                `}
                        >
                            {/* =========================================
                                    ICON
                                ========================================= */}

                            {Icon && (
                                <span
                                    className={`
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center

                                            rounded-md

                                            border

                                            transition-colors
                                            duration-150

                                            ${
                                                primary
                                                    ? `
                                                        border-[#4A515E]
                                                        bg-[#303641]
                                                        text-[#D3D6DC]!
                                                    `
                                                    : `
                                                        border-[#3A404B]
                                                        bg-[#272B34]
                                                        text-[#9299A6]!

                                                        group-hover:border-[#4A515E]
                                                        group-hover:bg-[#303641]
                                                        group-hover:text-[#D3D6DC]!
                                                    `
                                            }
                                        `}
                                >
                                    <Icon size={15} strokeWidth={1.7} />
                                </span>
                            )}

                            {/* =========================================
                                    LABEL
                                ========================================= */}

                            <span
                                className="
                                        min-w-0
                                        flex-1
                                        truncate

                                        text-[11.5px]
                                        font-medium

                                        text-[#C3C7CF]!

                                        transition-colors

                                        group-hover:text-[#F1F2F4]!
                                    "
                            >
                                {action.label}
                            </span>

                            {/* =========================================
                                    ARROW
                                ========================================= */}

                            <ArrowUpRight
                                size={14}
                                strokeWidth={1.7}
                                className="
                                        shrink-0

                                        text-[#626A78]!

                                        transition-all
                                        duration-150

                                        group-hover:-translate-y-px
                                        group-hover:translate-x-px
                                        group-hover:text-[#A8AFBB]!
                                    "
                            />
                        </button>
                    );
                })}

                {actions.length === 0 && (
                    <div
                        className="
                            px-5
                            py-8

                            text-center

                            text-[11px]

                            text-[#6F7785]!
                        "
                    >
                        No actions available.
                    </div>
                )}
            </div>
        </section>
    );
};

export default QuickActions;
