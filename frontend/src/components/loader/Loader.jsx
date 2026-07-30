import logo from '@/assets/shared/footerLogo.png';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-background">
            <div className="flex flex-col items-center animate-[fadeIn_.5s_ease] px-6 text-center">
                {/* Logo */}
                <img
                    src={logo}
                    alt="Stand For People"
                    className="mb-5 w-20 sm:w-24 md:w-28 animate-[breathe_3s_ease-in-out_infinite]"
                />

                <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-primary">
                    Stand For <span className="text-accent">People</span>
                </h1>

                <p className="mt-2 max-w-70 sm:max-w-xs text-xs sm:text-sm text-text-secondary">
                    Connecting kindness with action
                </p>

                {/* Loading Dots */}
                <div className="mt-8 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce" />

                    <span
                        className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: '0.15s' }}
                    />

                    <span
                        className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: '0.3s' }}
                    />
                </div>

                <p className="mt-5 text-xs uppercase tracking-[0.28em] text-text-secondary">
                    Connecting people who care
                </p>
            </div>

            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: translateY(12px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    @keyframes breathe {
                        0%, 100% {
                            transform: scale(1);
                            opacity: .9;
                        }
                        50% {
                            transform: scale(1.04);
                            opacity: 1;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default Loader;
