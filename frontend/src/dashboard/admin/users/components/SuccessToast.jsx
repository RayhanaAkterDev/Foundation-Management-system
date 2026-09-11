import React from 'react';

import { Check, Sparkles } from 'lucide-react';

const SuccessToast = ({ show, message }) => {
    if (!show) return null;

    return (
        <div
            role="status"
            aria-live="polite"
            className="
                pointer-events-none
                fixed
                right-4
                top-20
                z-100
                w-[calc(100vw-2rem)]
                max-w-97.5
                sm:right-6
                sm:top-22
                lg:right-8
            "
        >
            <div
                className="
                    relative
                    overflow-hidden
                    border
                    border-primary/15
                    bg-surface
                    shadow-[0_18px_50px_rgba(15,23,42,0.14)]
                "
            >
                {/* Accent edge */}
                <div className="absolute inset-y-0 left-0 w-1 bg-primary" />

                <div className="flex items-start gap-3.5 px-4 py-4 pl-5 sm:px-5 sm:py-4.5 sm:pl-6">
                    {/* Success icon */}
                    <div
                        className="
                            relative
                            flex h-10 w-10
                            shrink-0
                            items-center justify-center
                            border border-primary/15
                            bg-primary/8
                            text-primary
                        "
                    >
                        <Check size={18} strokeWidth={2.5} />

                        <span
                            className="
                                absolute
                                -right-1
                                -top-1
                                flex h-3.5 w-3.5
                                items-center justify-center
                                bg-accent
                            "
                        >
                            <Sparkles
                                size={8}
                                strokeWidth={2.5}
                                className="text-white"
                            />
                        </span>
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 pt-0.5">
                        <div className="mb-1 flex items-center gap-2">
                            <span
                                className="
                                    font-[Poppins]
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-primary
                                "
                            >
                                Completed
                            </span>

                            <span className="h-px w-5 bg-primary/20" />
                        </div>

                        <p
                            className="
                                wrap-break-word
                                pr-1
                                font-[Jost]
                                text-[13px]
                                font-medium
                                leading-[1.55]
                                text-text-primary
                                sm:text-[14px]
                            "
                        >
                            {message}
                        </p>
                    </div>

                    {/* Status mark */}
                    <span
                        className="
                            mt-1
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-accent
                        "
                    />
                </div>

                {/* Completion line */}
                <div className="h-0.5 w-full bg-primary/8">
                    <div className="h-full w-full bg-primary" />
                </div>
            </div>
        </div>
    );
};

export default SuccessToast;
