import React from 'react';
import { AlertCircle } from 'lucide-react';

/* ==========================================================================
   LOADING ERROR — SHARED DASHBOARD COMPONENT
============================================================================ */

const LoadingError = ({
    title = 'Unable to load data',
    message = 'Something went wrong while loading the requested information.',
    className = '',
}) => {
    return (
        <div
            role="alert"
            className={`
                relative w-full min-w-0
                overflow-hidden
                border border-[#34303A]
                bg-[#17191F]
                ${className}
            `}
        >
            {/* RESTRAINED ERROR INDICATOR */}

            <span
                aria-hidden="true"
                className="
                    absolute inset-y-0 left-0
                    w-[2px] bg-[#B77C83]
                "
            />

            <div
                className="
                    flex min-w-0 items-start
                    gap-4 px-5 py-5
                    sm:gap-5 sm:px-6 sm:py-6
                "
            >
                {/* ICON */}

                <div
                    className="
                        flex h-10 w-10 shrink-0
                        items-center justify-center
                        border border-[#48363D]
                        bg-[#292126]
                        text-[#C58B92]
                    "
                >
                    <AlertCircle size={18} strokeWidth={1.7} />
                </div>

                {/* CONTENT */}

                <div className="min-w-0 flex-1 pt-0.5">
                    <h3
                        className="
                            font-sans!
                            text-[14px] font-semibold!
                            leading-5
                            tracking-[-0.01em]
                            text-[#E2C2C6]!
                            sm:text-[15px]
                        "
                    >
                        {title}
                    </h3>

                    {message && (
                        <p
                            className="
                                mt-2 max-w-2xl
                                wrap-break-word
                                font-sans!
                                text-[12px]
                                leading-[1.8]
                                text-[#A9A0A8]!
                                sm:text-[13px]
                            "
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoadingError;
