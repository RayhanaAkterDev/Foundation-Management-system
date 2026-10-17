import React from 'react';

/* ==========================================================================
   PAGE HEADER
============================================================================ */

const PageHeader = ({ title, subtitle, action, eyebrow }) => {
    return (
        <header className="@container mb-8 w-full min-w-0">
            <div
                className="
                    relative isolate overflow-hidden
                    border-b border-[#29313c]
                    pb-7 pt-5
                    sm:pb-8 sm:pt-6
                    lg:pb-9 lg:pt-7
                "
            >
                {/* BRAND WATERMARK */}

                <div
                    aria-hidden="true"
                    className="
        pointer-events-none
        absolute
        right-0
        top-0
        z-0
        select-none
    "
                >
                    <div
                        className="
            flex
            flex-col
            items-end
            gap-1
            border-r-2
            border-[#526071]/40
            pr-4
            text-right
        "
                    >
                        <span
                            className="
                font-sans!
                text-[11px]
                font-semibold!
                uppercase
                tracking-[0.32em]
                text-[#778393]/35
            "
                        >
                            STAND FOR
                        </span>

                        <span
                            className="
                font-sans!
                text-[29px]
                font-semibold!
                uppercase
                leading-none
                tracking-[0.06em]
                text-[#8793A2]/[0.09]

                @[1000px]:text-[36px]
            "
                        >
                            PEOPLE
                        </span>
                    </div>
                </div>

                {/* HEADER CONTENT */}

                <div
                    className="
                        relative z-10 grid min-w-0
                        grid-cols-1 gap-5
                        @[820px]:grid-cols-[minmax(0,1fr)_auto]
                        @[820px]:items-end
                        @[820px]:gap-8
                    "
                >
                    {/* TITLE AREA */}

                    <div className="min-w-0">
                        {eyebrow && (
                            <div className="mb-3 flex items-center gap-2.5">
                                <span
                                    aria-hidden="true"
                                    className="
                                        h-[3px] w-5 shrink-0
                                        rounded-full bg-[#f59e0b]
                                    "
                                />

                                <p
                                    className="
                                        text-[10px] font-semibold
                                        uppercase tracking-[0.19em]
                                        text-[#91a0b1]
                                        sm:text-[11px]
                                    "
                                >
                                    {eyebrow}
                                </p>
                            </div>
                        )}

                        <h1
                            className="
                                max-w-5xl wrap-break-word
                                font-serif text-[37px]
                                font-medium leading-[1.12]
                                tracking-[-0.045em]
                                text-[#f4f5f7]!

                                sm:text-[44px]
                                @[1000px]:text-[49px]
                                @[1200px]:text-[52px]
                            "
                        >
                            {title}
                        </h1>

                        {subtitle && (
                            <p
                                className="
                                    mt-3 max-w-xl
                                    text-[13px] leading-[1.85]
                                    text-[#a5b0be]
                                    sm:mt-3.5 sm:text-[14px]
                                    sm:leading-[1.9]
                                "
                            >
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* ACTION AREA */}

                    {action && (
                        <div
                            className="
                                flex min-w-0 flex-wrap
                                items-center gap-2.5
                                @[820px]:shrink-0
                                @[820px]:justify-end
                                @[820px]:pb-1
                            "
                        >
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default PageHeader;
