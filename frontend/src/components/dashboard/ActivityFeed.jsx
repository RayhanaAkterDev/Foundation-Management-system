import React from 'react';

import {
    Activity,
    Building2,
    HandCoins,
    HeartHandshake,
    Megaphone,
    ShieldCheck,
    User,
    Users,
} from 'lucide-react';

/* ==========================================================================
   ACTIVITY TYPES
============================================================================ */

const TYPE_ICON = {
    donation: HandCoins,
    helpRequest: HeartHandshake,
    volunteer: Users,
    campaign: Megaphone,
    organization: Building2,
    verification: ShieldCheck,
    user: User,
    response: HeartHandshake,
};

/* ==========================================================================
   ACTIVITY FEED
============================================================================ */

const ActivityFeed = ({ items = [], title = 'Recent Activity' }) => {
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
                    <div
                        className="
                            flex
                            items-center
                            gap-2.5
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                h-1.5
                                w-1.5

                                rounded-full

                                bg-[#9299A6]
                            "
                        />

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
                    </div>
                </header>
            )}

            {/* =============================================================
                EMPTY
            ============================================================= */}

            {items.length === 0 ? (
                <div
                    className="
                        flex
                        min-h-[180px]
                        items-center
                        justify-center

                        px-5
                        py-8
                    "
                >
                    <div className="text-center">
                        <Activity
                            size={19}
                            strokeWidth={1.6}
                            className="
                                mx-auto
                                text-[#626A78]!
                            "
                        />

                        <p
                            className="
                                mt-3

                                text-[11.5px]

                                text-[#7F8794]!
                            "
                        >
                            No recent activity.
                        </p>
                    </div>
                </div>
            ) : (
                /* =========================================================
                   LIST
                ========================================================= */

                <ol>
                    {items.map((item, index) => {
                        const Icon = TYPE_ICON[item.type] || Activity;

                        const last = index === items.length - 1;

                        return (
                            <li
                                key={item.id ?? index}
                                className="
                                        group

                                        relative

                                        flex
                                        gap-3.5

                                        px-4
                                        py-4

                                        transition-colors
                                        duration-150

                                        hover:bg-[#272B34]

                                        sm:px-5
                                    "
                            >
                                {/* =====================================
                                        TIMELINE
                                    ===================================== */}

                                <div
                                    className="
                                            relative

                                            flex
                                            shrink-0
                                            flex-col
                                            items-center
                                        "
                                >
                                    <span
                                        className="
                                                relative
                                                z-10

                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center

                                                rounded-md

                                                border
                                                border-[#3A404B]

                                                bg-[#2C303A]

                                                text-[#A8AFBB]!

                                                transition-colors
                                                duration-150

                                                group-hover:border-[#4A515E]
                                                group-hover:bg-[#303641]
                                                group-hover:text-[#D3D6DC]!
                                            "
                                    >
                                        <Icon size={15} strokeWidth={1.7} />
                                    </span>

                                    {!last && (
                                        <span
                                            aria-hidden="true"
                                            className="
                                                    absolute
                                                    bottom-[-16px]
                                                    top-8

                                                    w-px

                                                    bg-[#343944]
                                                "
                                        />
                                    )}
                                </div>

                                {/* =====================================
                                        CONTENT
                                    ===================================== */}

                                <div
                                    className="
                                            min-w-0
                                            flex-1

                                            pt-0.5
                                        "
                                >
                                    <p
                                        className="
                                                text-[11.5px]
                                                leading-5

                                                text-[#C3C7CF]!
                                            "
                                    >
                                        {item.text}
                                    </p>

                                    {item.time && (
                                        <p
                                            className="
                                                    mt-1

                                                    text-[9.5px]

                                                    text-[#6F7785]!
                                                "
                                        >
                                            {item.time}
                                        </p>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
};

export default ActivityFeed;
