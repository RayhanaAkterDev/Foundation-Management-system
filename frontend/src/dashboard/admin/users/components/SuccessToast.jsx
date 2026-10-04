import React from 'react';

import { CheckCircle2 } from 'lucide-react';

const SuccessToast = ({ show, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className="
                pointer-events-none

                fixed
                left-3
                right-3
                top-17
                z-100

                sm:left-auto
                sm:right-5
                sm:top-20
                sm:w-[360px]

                lg:right-7
            "
        >
            <div
                className="
                    relative
                    overflow-hidden

                    border
                    border-[#3D514A]

                    bg-[#222A28]

                    shadow-[0_16px_40px_rgba(0,0,0,0.28)]
                "
            >
                {/* =====================================================
                    LEFT STATUS EDGE
                ===================================================== */}

                <span
                    aria-hidden="true"
                    className="
                        absolute
                        bottom-0
                        left-0
                        top-0

                        w-0.5

                        bg-[#6FA28F]
                    "
                />

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div
                    className="
                        flex
                        items-start
                        gap-3

                        px-4
                        py-3.5
                        pl-4.5

                        sm:px-4.5
                        sm:py-4
                        sm:pl-5
                    "
                >
                    <div
                        className="
                            mt-0.5

                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center

                            border
                            border-[#40574F]

                            bg-[#293A35]

                            text-[#8DBAA9]
                        "
                    >
                        <CheckCircle2 size={15} strokeWidth={2} />
                    </div>

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                            "
                        >
                            <span
                                className="
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]

                                    text-[#7FA997]
                                "
                            >
                                Success
                            </span>

                            <span
                                className="
                                    h-px
                                    w-4
                                    bg-[#40574F]
                                "
                            />
                        </div>

                        <p
                            className="
                                mt-1

                                wrap-break-word

                                text-[12px]
                                font-medium
                                leading-5

                                text-[#E3E6E9]

                                sm:text-[13px]
                            "
                        >
                            {message}
                        </p>
                    </div>

                    <span
                        aria-hidden="true"
                        className="
                            mt-1.5
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                            bg-[#6FA28F]
                        "
                    />
                </div>

                {/* =====================================================
                    BOTTOM DETAIL
                ===================================================== */}

                <div
                    className="
                        h-px
                        w-full
                        bg-[#33443E]
                    "
                />
            </div>
        </div>
    );
};

export default SuccessToast;
