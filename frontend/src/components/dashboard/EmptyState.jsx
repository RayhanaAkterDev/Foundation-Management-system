import React from 'react';

import {
    ArrowRight,
    Inbox,
} from 'lucide-react';

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
                    border-[#3A404B]

                    bg-[#2C303A]

                    text-[#9299A6]!
                "
            >
                <Icon
                    size={20}
                    strokeWidth={1.6}
                />
            </div>

            {/* =============================================================
                CONTENT
            ============================================================= */}

            <h3
                className="
                    mt-4

                    font-sans!

                    text-[14px]
                    font-semibold
                    tracking-[-0.01em]

                    text-[#E5E7EB]!
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

                        text-[#7F8794]!
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
                        border-[#404754]

                        bg-[#303641]

                        px-3.5

                        text-[11px]
                        font-semibold

                        text-[#E5E7EB]!

                        transition-colors
                        duration-150

                        hover:border-[#515966]
                        hover:bg-[#393F4C]
                        hover:text-[#FFFFFF]!

                        focus:outline-none
                    "
                >
                    <span>
                        {action.label}
                    </span>

                    <ArrowRight
                        size={13}
                        strokeWidth={1.8}
                        className="
                            text-[#9299A6]!

                            transition-transform
                            duration-150

                            group-hover:translate-x-0.5
                            group-hover:text-[#D3D6DC]!
                        "
                    />
                </button>
            )}
        </div>
    );
};

export default EmptyState;