import React from 'react';

import { ArrowRight, Inbox } from 'lucide-react';

/* ==========================================================================
   EMPTY STATE
============================================================================ */

const EmptyState = ({
    icon: Icon = Inbox,
    title = 'Nothing here yet',
    message,
    action,
}) => {
    return (
        <div
            className="
                flex
                min-h-[250px]
                flex-col
                items-center
                justify-center

                px-5
                py-10

                text-center

                sm:min-h-[280px]
                sm:px-8
                sm:py-12
            "
        >
            {/* =============================================================
                ICON
            ============================================================= */}

            <div
                className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center

                    rounded-lg

                    border
                    border-[#29323E]

                    bg-[#151B24]

                    text-[#7F8A99]!
                "
            >
                <Icon size={20} strokeWidth={1.6} />
            </div>

            {/* =============================================================
                CONTENT
            ============================================================= */}

            <h3
                className="
                    mt-4

                    font-sans!

                    text-[14px]
                    font-semibold!
                    tracking-[-0.01em]

                    text-[#EEF1F5]!
                "
            >
                {title}
            </h3>

            {message && (
                <p
                    className="
                        mt-1.5
                        max-w-[360px]

                        text-[11.5px]
                        leading-5

                        text-[#7F8A99]!
                    "
                >
                    {message}
                </p>
            )}

            {/* =============================================================
                ACTION
            ============================================================= */}

            {action && (
                <button
                    type="button"
                    onClick={action.onClick}
                    className="
                        group

                        mt-5

                        inline-flex
                        min-h-9
                        items-center
                        justify-center
                        gap-2

                        rounded-md

                        border
                        border-[#303A47]

                        bg-[#171E28]

                        px-3.5

                        text-[11px]
                        font-semibold!

                        text-[#DCE1E7]!

                        transition-colors
                        duration-150

                        hover:border-[#465261]
                        hover:bg-[#1D2632]
                        hover:text-[#EEF1F5]!

                        focus:outline-none
                        focus:ring-0
                    "
                >
                    <span>{action.label}</span>

                    <ArrowRight
                        size={13}
                        strokeWidth={1.8}
                        className="
                            text-[#7F8A99]!

                            transition-[transform,color]
                            duration-150

                            group-hover:translate-x-0.5
                            group-hover:text-[#B8C0CA]!
                        "
                    />
                </button>
            )}
        </div>
    );
};

export default EmptyState;
