import React from 'react';
import logo from '@/assets/shared/logo.png';

const Loader = () => {
    return (
        <main
            lang="bn"
            role="status"
            aria-live="polite"
            aria-label="পৃষ্ঠা লোড হচ্ছে"
            className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-5 font-bengali"
        >
            <div className="relative flex w-full max-w-[360px] flex-col items-center text-center">
                {/* Brand identity and animation */}
                <div className="relative mb-8 flex h-[176px] w-[176px] items-center justify-center sm:h-[192px] sm:w-[192px]">
                    {/* Outer stationary ring */}
                    <div className="absolute inset-0 rounded-full border border-primary/10" />

                    {/* Animated orbit */}
                    <div className="absolute inset-[8px] animate-[spin_3s_linear_infinite] rounded-full border-[2px] border-transparent border-t-primary/70 border-r-primary/15 motion-reduce:animate-none" />

                    {/* Inner decorative circle */}
                    <div className="absolute inset-[22px] rounded-full bg-primary/[0.035]" />

                    {/* Logo */}
                    <img
                        src={logo}
                        alt="Stand For People"
                        className="relative z-10 h-auto w-[112px] object-contain sm:w-[124px]"
                    />
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h1 className="text-[21px] font-semibold leading-[1.5] text-text-primary sm:text-[23px]">
                        একটু অপেক্ষা করুন
                    </h1>

                    <p className="mx-auto max-w-[290px] text-[12px] leading-[1.8] text-text-secondary sm:text-[13px]">
                        আপনার জন্য প্রয়োজনীয় তথ্য প্রস্তুত করা হচ্ছে
                    </p>
                </div>

                {/* Progress indicator */}
                <div
                    aria-hidden="true"
                    className="mt-8 flex items-center justify-center gap-2"
                >
                    {[0, 1, 2, 3].map((item) => (
                        <span
                            key={item}
                            className="h-[5px] w-[5px] rounded-full bg-primary motion-safe:animate-[spPulse_1.4s_ease-in-out_infinite]"
                            style={{
                                animationDelay: `${item * 0.16}s`,
                            }}
                        />
                    ))}
                </div>

                {/* Bottom brand line */}
                <div className="mt-10 flex items-center gap-3">
                    <span className="h-px w-7 bg-primary/15" />
                    <span className="text-[11px] font-medium tracking-[0.01em] text-text-secondary/70">
                        মানুষের পাশে, প্রতিটি মুহূর্তে
                    </span>
                    <span className="h-px w-7 bg-primary/15" />
                </div>
            </div>

            <style>
                {`
          @keyframes spPulse {
            0%, 80%, 100% {
              opacity: 0.25;
              transform: scale(0.8);
            }
            40% {
              opacity: 1;
              transform: scale(1.3);
            }
          }
        `}
            </style>
        </main>
    );
};

export default Loader;
