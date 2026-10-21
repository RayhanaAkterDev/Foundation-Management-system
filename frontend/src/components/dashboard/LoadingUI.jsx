import React from 'react';

/* ==========================================================================
   LOADING UI — SHARED DASHBOARD COMPONENT
============================================================================ */

const LoadingUI = ({
    variant = 'page',
    title = 'Loading...',
    description = '',
    className = '',
    minHeight,
}) => {
    /* ======================================================================
       BUTTON LOADING
    ====================================================================== */

    if (variant === 'button') {
        return (
            <span
                role="status"
                aria-live="polite"
                className={`
                    inline-flex min-w-0 items-center
                    justify-center gap-2.5
                    ${className}
                `}
            >
                <span
                    aria-hidden="true"
                    className="
                        h-3.5 w-3.5 shrink-0
                        animate-spin
                        rounded-full
                        border-[1.5px]
                        border-current/25
                        border-t-current
                        motion-reduce:animate-none
                    "
                />

                <span>{title}</span>
            </span>
        );
    }

    /* ======================================================================
       INLINE LOADING
    ====================================================================== */

    if (variant === 'inline') {
        return (
            <div
                role="status"
                aria-live="polite"
                className={`
                    inline-flex min-w-0 items-center gap-3
                    ${className}
                `}
            >
                <span
                    aria-hidden="true"
                    className="
                        h-4 w-4 shrink-0
                        animate-spin
                        rounded-full
                        border-[1.5px]
                        border-[#303A47]
                        border-t-[#AAB5C3]
                        motion-reduce:animate-none
                    "
                />

                <span
                    className="
                        min-w-0 font-sans!
                        text-[12px] font-medium!
                        leading-5 text-[#AAB3BF]!
                        wrap-anywhere
                    "
                >
                    {title}
                </span>
            </div>
        );
    }

    /* ======================================================================
       PAGE / SECTION LOADING
    ====================================================================== */

    const isPage = variant === 'page';

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={title}
            className={`
                relative flex w-full min-w-0
                items-center justify-center
                overflow-hidden
                border border-[#252D38]
                bg-[#0E1219]
                ${
                    isPage
                        ? 'min-h-70 sm:min-h-100 lg:min-h-130'
                        : 'min-h-36 sm:min-h-44'
                }
                ${className}
            `}
            style={minHeight ? { minHeight } : undefined}
        >
            <div
                className="
                    flex w-full max-w-sm
                    flex-col items-center
                    px-5 py-10 text-center
                    sm:px-8 sm:py-12
                "
            >
                {/* LOADING CONTENT */}

                <h3
                    className="
                        font-sans!
                        text-[14px] font-semibold!
                        leading-6
                        tracking-[-0.01em]
                        text-[#DCE2EA]!
                        sm:text-[15px]
                    "
                >
                    {title}
                </h3>

                {description && (
                    <p
                        className="
                            mt-2 w-full mb-6
                            font-sans!
                            text-[12px]
                            leading-[1.75]
                            text-[#8792A1]!
                            wrap-anywhere
                            sm:text-[13px]
                        "
                    >
                        {description}
                    </p>
                )}

                {/* SINGLE ANIMATED LOADING INDICATOR */}

                <div
                    aria-hidden="true"
                    className="
                        relative h-[3px] w-20
                        overflow-hidden
                        bg-[#29323E]
                        sm:w-24
                    "
                >
                    <span
                        className="
                            absolute inset-y-0 left-0
                            w-2/5 bg-[#A2ADBB]
                            animate-[loading-progress_1.4s_ease-in-out_infinite]
                            motion-reduce:animate-none
                        "
                    />
                </div>
            </div>

            <style>
                {`
                    @keyframes loading-progress {
                        0% {
                            transform: translateX(-100%);
                        }

                        100% {
                            transform: translateX(250%);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingUI;
