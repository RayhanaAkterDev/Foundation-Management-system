import logo from '@/assets/shared/logo.png';

const Loader = () => {
    return (
        <div
            className="
                fixed inset-0 z-[9999]
                flex items-center justify-center
                overflow-hidden
                bg-background
                px-6
            "
        >
            <div
                className="
                    flex w-full max-w-[520px]
                    flex-col items-center
                    text-center
                    animate-[loaderReveal_.45s_ease-out_both]
                "
            >
                {/* =====================================================
                    LOGO
                ====================================================== */}
                <div className="relative flex items-center justify-center">
                    {/* Subtle ambient background */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            h-[220px]
                            w-[220px]
                            rounded-full
                            bg-primary/[0.035]
                            blur-[55px]

                            sm:h-[270px]
                            sm:w-[270px]
                        "
                    />

                    <img
                        src={logo}
                        alt="Stand For People"
                        className="
                            relative
                            w-[150px]
                            object-contain

                            sm:w-[175px]
                            md:w-[190px]

                            animate-[logoBreathe_3s_ease-in-out_infinite]
                        "
                    />
                </div>

                {/* =====================================================
                    MESSAGE
                ====================================================== */}
                <div className="mt-8 sm:mt-9">
                    <p
                        className="
                            font-bengali
                            text-[18px]
                            font-medium
                            leading-[1.7]
                            tracking-[-0.01em]
                            text-text-primary

                            sm:text-[20px]
                            md:text-[21px]
                        "
                    >
                        মানুষের পাশে, মানুষের জন্য
                    </p>

                    <p
                        className="
                            mt-2
                            font-bengali
                            text-[13px]
                            font-normal
                            leading-7
                            text-text-secondary

                            sm:text-[14px]
                        "
                    >
                        সহায়তার সাথে মানুষকে যুক্ত করছি
                    </p>
                </div>

                {/* =====================================================
                    LOADING
                ====================================================== */}
                <div
                    className="
                        mt-9
                        flex
                        flex-col
                        items-center

                        sm:mt-10
                    "
                >
                    {/* Progress track */}
                    <div
                        className="
                            relative
                            h-[2px]
                            w-[155px]
                            overflow-hidden
                            rounded-full
                            bg-primary/10

                            sm:w-[180px]
                        "
                    >
                        <span
                            className="
                                absolute
                                inset-y-0
                                left-0
                                w-[42%]
                                rounded-full
                                bg-primary

                                animate-[loaderLine_1.8s_ease-in-out_infinite]
                            "
                        />
                    </div>

                    {/* Loading text */}
                    <div
                        className="
                            mt-5
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-accent
                                animate-[statusPulse_1.6s_ease-in-out_infinite]
                            "
                        />

                        <span
                            className="
                                font-bengali
                                text-[12px]
                                font-medium
                                leading-none
                                text-text-secondary/75

                                sm:text-[13px]
                            "
                        >
                            একটু অপেক্ষা করুন
                        </span>
                    </div>
                </div>
            </div>

            <style>
                {`
                    @keyframes loaderReveal {
                        from {
                            opacity: 0;
                            transform: translateY(6px);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes logoBreathe {
                        0%,
                        100% {
                            transform: scale(1);
                            opacity: 0.95;
                        }

                        50% {
                            transform: scale(1.025);
                            opacity: 1;
                        }
                    }

                    @keyframes loaderLine {
                        0% {
                            transform: translateX(-110%);
                        }

                        50% {
                            transform: translateX(120%);
                        }

                        100% {
                            transform: translateX(260%);
                        }
                    }

                    @keyframes statusPulse {
                        0%,
                        100% {
                            opacity: 0.4;
                            transform: scale(0.85);
                        }

                        50% {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }

                    @media (prefers-reduced-motion: reduce) {
                        * {
                            animation-duration: 0.01ms !important;
                            animation-iteration-count: 1 !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;
