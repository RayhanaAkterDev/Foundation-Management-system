import React from 'react';

/* ==========================================================================
   PAGE HEADER
============================================================================ */

const PageHeader = ({ title, subtitle, action, eyebrow, meta }) => {
    return (
        <header
            className="
                relative
                mb-6
                border-b
                border-[#343944]
                pb-5

                sm:mb-7
                sm:pb-6

                lg:mb-8
                lg:pb-7
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-5

                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                    sm:gap-8
                "
            >
                {/* =========================================================
                    CONTENT
                ========================================================= */}

                <div className="min-w-0 flex-1">
                    {eyebrow && (
                        <div
                            className="
                                mb-2.5
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
                                    shrink-0
                                    bg-[#9299A6]
                                "
                            />

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#9299A6]!
                                "
                            >
                                {eyebrow}
                            </p>
                        </div>
                    )}

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-3
                        "
                    >
                        <span
                            aria-hidden="true"
                            className="
                                hidden
                                h-7
                                w-[3px]
                                shrink-0
                                bg-[#6F7785]

                                sm:block
                            "
                        />

                        <h1
                            className="
                                min-w-0

                                font-sans!
                                text-[24px]
                                font-semibold
                                leading-[1.15]
                                tracking-[-0.035em]
                                text-[#F1F2F4]!

                                sm:text-[27px]

                                lg:text-[30px]
                            "
                        >
                            {title}
                        </h1>
                    </div>

                    {subtitle && (
                        <p
                            className="
                                mt-2.5
                                max-w-[680px]

                                text-[13px]
                                leading-[1.65]
                                text-[#9299A6]!

                                sm:ml-[15px]
                                sm:text-[13.5px]

                                lg:text-[14px]
                            "
                        >
                            {subtitle}
                        </p>
                    )}

                    {meta && (
                        <div
                            className="
                                mt-3.5

                                text-[11px]
                                leading-5
                                text-[#6F7785]!

                                sm:ml-[15px]
                            "
                        >
                            {meta}
                        </div>
                    )}
                </div>

                {/* =========================================================
                    ACTIONS
                ========================================================= */}

                {action && (
                    <div
                        className="
                            w-full
                            shrink-0

                            sm:w-auto
                            sm:pb-0.5
                        "
                    >
                        {action}
                    </div>
                )}
            </div>

            {/* =============================================================
                BOTTOM DETAIL
            ============================================================= */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -bottom-px
                    left-0
                    flex
                    items-center
                "
            >
                <span className="h-px w-12 bg-[#9299A6]" />
                <span className="h-px w-5 bg-[#6F7785]" />
            </div>
        </header>
    );
};

export default PageHeader;
