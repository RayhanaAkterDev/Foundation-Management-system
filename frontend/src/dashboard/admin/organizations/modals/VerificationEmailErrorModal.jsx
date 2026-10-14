import React from 'react';

import { AlertCircle, X } from 'lucide-react';

const VerificationEmailErrorModal = ({ show, message, onClose }) => {
    if (!show) {
        return null;
    }

    return (
        <div
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="verification-email-error-title"
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
                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-md
                        text-[#747F8E]
                        transition-colors
                        duration-150
                        hover:bg-[#181E27]
                        hover:text-[#E7EBF0]
                        focus:outline-none
                    "
                >
                    <X size={18} strokeWidth={1.9} />
                </button>

                {/* Error icon */}
                <div className="flex justify-center">
                    <div
                        className="
                            flex
                            h-[58px]
                            w-[58px] rounded-full
                            items-center
                            justify-center
                            bg-[#21171A]
                            text-[#D77980]!
                        "
                    >
                        <AlertCircle
                            size={46}
                            strokeWidth={1.8}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="mt-5 text-center">
                    <h2
                        id="verification-email-error-title"
                        className="
                            text-[19px]
                            font-semibold!
                            leading-[1.4]
                            tracking-[-0.01em]
                            text-[#EEF1F5]!
                            sm:text-[20px]
                        "
                    >
                        Email verification required
                    </h2>

                    <p
                        className="
                            mx-auto
                            mt-2.5
                            max-w-[350px]
                            text-[13px]
                            leading-[1.7]
                            text-[#98A2B0]
                            sm:text-[14px]
                        "
                    >
                        {message}
                    </p>
                </div>

                {/* Action */}
                <div className="mt-6 flex justify-center">
                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            inline-flex
                            h-10
                            min-w-[112px]
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[#3A4451]
                            bg-[#1A212B]
                            px-6
                            text-[13px]
                            font-semibold!
                            text-[#EEF1F5]
                            transition-colors
                            duration-150
                            hover:border-[#4A5665]
                            hover:bg-[#222A35]
                            focus:outline-none
                        "
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VerificationEmailErrorModal;