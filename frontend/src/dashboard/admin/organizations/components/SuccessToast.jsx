import React from 'react';

import { Check } from 'lucide-react';

const SuccessToast = ({ show, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className="
                fixed
                inset-0
                z-[110]

                flex
                items-center
                justify-center

                bg-[#05070A]/75

                px-4
                py-6

                backdrop-blur-[2px]
            "
        >
            <div
                className="
                    relative
                    w-full
                    max-w-[430px]

                    rounded-xl

                    border
                    border-[#2A313B]

                    bg-[#0E1219]

                    px-6
                    pb-7
                    pt-8

                    shadow-[0_24px_70px_rgba(0,0,0,0.5)]

                    sm:px-8
                    sm:pb-8
                    sm:pt-9
                "
            >
                {/* Success icon */}
                <div className="flex justify-center">
                    <div
                        className="
                            flex
                            h-[58px]
                            w-[58px]
                            items-center
                            justify-center

                            rounded-full

                            border-2
                            border-[#6FAE87]

                            bg-[#17231D]

                            text-[#8EC5A3]
                        "
                    >
                        <Check size={30} strokeWidth={2} />
                    </div>
                </div>

                {/* Content */}
                <div className="mt-5 text-center">
                    <h2
                        className="
                            font-sans!
                            text-[19px]
                            font-semibold!
                            leading-[1.4]
                            tracking-[-0.01em]

                            text-[#EEF1F5]!

                            sm:text-[20px]
                        "
                    >
                        Update successful
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-2.5
                            max-w-[350px]

                            wrap-break-word

                            font-sans!
                            text-[13px]
                            font-normal!
                            leading-[1.7]

                            text-[#98A2B0]!

                            sm:text-[14px]
                        "
                    >
                        {message}
                    </p>
                </div>

                {/* Status */}
                <div className="mt-6 flex justify-center">
                    <div
                        className="
                            inline-flex
                            h-10
                            items-center
                            justify-center
                            gap-2

                            rounded-lg

                            border
                            border-[#365344]

                            bg-[#18231D]

                            px-5

                            font-sans!
                            text-[13px]
                            font-semibold!

                            text-[#8EC5A3]!
                        "
                    >
                        <Check size={15} strokeWidth={2.2} />
                        Done
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessToast;
