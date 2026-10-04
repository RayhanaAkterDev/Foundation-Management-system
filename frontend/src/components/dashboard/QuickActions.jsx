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
                border-[#252D38]

                bg-[#0E1219]
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
                        border-[#252D38]

                        bg-[#121821]

                        px-4

                        sm:px-5
                    "
                >
                    <h2
                        className="
                            font-sans!

                            text-[12px]
                            font-semibold!

                            text-[#EEF1F5]!
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
                    divide-[#202832]
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
                                ease-out

                                sm:px-5

                                ${primary ? 'bg-[#171E28]' : 'bg-[#0E1219]'}

                                hover:bg-[#151B24]

                                focus:outline-none
                                focus:ring-0
                            `}
                        >
                            {/* =============================================
                                ICON
                            ============================================= */}

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
                                                    border-[#394555]
                                                    bg-[#1D2632]
                                                    text-[#C7CED7]!
                                                `
                                                : `
                                                    border-[#29323E]
                                                    bg-[#151B24]
                                                    text-[#7F8A99]!

                                                    group-hover:border-[#394555]
                                                    group-hover:bg-[#1A222D]
                                                    group-hover:text-[#B8C0CA]!
                                                `
                                        }
                                    `}
                                >
                                    <Icon size={15} strokeWidth={1.7} />
                                </span>
                            )}

                            {/* =============================================
                                LABEL
                            ============================================= */}

                            <span
                                className="
                                    min-w-0
                                    flex-1
                                    truncate

                                    text-[11.5px]
                                    font-medium!

                                    text-[#B8C0CA]!

                                    transition-colors
                                    duration-150

                                    group-hover:text-[#EEF1F5]!
                                "
                            >
                                {action.label}
                            </span>

                            {/* =============================================
                                ARROW
                            ============================================= */}

                            <ArrowUpRight
                                size={14}
                                strokeWidth={1.7}
                                className="
                                    shrink-0

                                    text-[#5F6B7A]!

                                    transition-[transform,color]
                                    duration-150

                                    group-hover:-translate-y-px
                                    group-hover:translate-x-px
                                    group-hover:text-[#A6AFBB]!
                                "
                            />
                        </button>
                    );
                })}

                {/* =========================================================
                    EMPTY
                ========================================================= */}

                {actions.length === 0 && (
                    <div
                        className="
                            bg-[#0E1219]

                            px-5
                            py-8

                            text-center

                            text-[11px]

                            text-[#697586]!
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
