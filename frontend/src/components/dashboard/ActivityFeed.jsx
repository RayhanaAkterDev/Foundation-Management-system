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

                                bg-[#697586]
                            "
                        />

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

                        bg-[#0E1219]

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

                                text-[#5F6B7A]!
                            "
                        />

                        <p
                            className="
                                mt-3

                                text-[11.5px]

                                text-[#7F8A99]!
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

                                    bg-[#0E1219]

                                    px-4
                                    py-4

                                    transition-colors
                                    duration-150
                                    ease-out

                                    hover:bg-[#151B24]

                                    sm:px-5
                                "
                            >
                                {/* =========================================
                                    TIMELINE
                                ========================================= */}

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
                                            border-[#29323E]

                                            bg-[#151B24]

                                            text-[#7F8A99]!

                                            transition-colors
                                            duration-150

                                            group-hover:border-[#394555]
                                            group-hover:bg-[#1A222D]
                                            group-hover:text-[#B8C0CA]!
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

                                                bg-[#252D38]
                                            "
                                        />
                                    )}
                                </div>

                                {/* =========================================
                                    CONTENT
                                ========================================= */}

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

                                            text-[#B8C0CA]!

                                            transition-colors
                                            duration-150

                                            group-hover:text-[#D5DAE0]!
                                        "
                                    >
                                        {item.text}
                                    </p>

                                    {item.time && (
                                        <p
                                            className="
                                                mt-1

                                                text-[9.5px]

                                                text-[#697586]!
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
