import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
    return (
        <section className="section-gap bg-primary/95 relative overflow-hidden">
            {/* background atmosphere */}
            <div className="absolute inset-0 bg-linear-to-br from-white/5 via-transparent to-black/20 pointer-events-none" />

            {/* radial glow */}
            <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(circle at top, rgba(255,255,255,0.12), transparent 60%)',
                }}
            />

            <div className="container-width relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* LEFT SIDE */}
                    <div className="text-left">
                        <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-surface/70">
                            Join the movement
                        </p>

                        <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-5xl font-semibold text-surface leading-tight">
                            Turn real-world needs into verified action
                        </h2>

                        <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-surface/80 leading-relaxed max-w-md">
                            Every request goes through AI filtering, human
                            verification, and structured prioritization before
                            it reaches real support.
                        </p>

                        {/* trust points */}
                        <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-surface/70 space-y-1">
                            <p>✔ Verified requests only</p>
                            <p>✔ Human + AI validation</p>
                            <p>✔ Transparent prioritization</p>
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div
                        className="
                        bg-white/10
                        backdrop-blur-md
                        border border-white/20
                        rounded-2xl sm:rounded-3xl
                        p-5 sm:p-8 md:p-10
                        shadow-xl
                    "
                    >
                        <h3 className="text-lg sm:text-xl font-semibold text-surface">
                            Get started
                        </h3>

                        <p className="mt-2 text-xs sm:text-sm text-surface/80">
                            Choose how you want to participate in the system.
                        </p>

                        {/* primary CTA */}
                        <Link
                            to="/request-help"
                            className="
                                mt-5 sm:mt-6 block text-center
                                px-5 sm:px-6 py-2.5 sm:py-3
                                rounded-lg sm:rounded-xl
                                bg-surface
                                text-primary
                                font-semibold
                                shadow-md
                                hover:shadow-lg
                                transition
                                text-sm sm:text-base
                            "
                        >
                            Submit a Request
                        </Link>

                        {/* secondary CTA */}
                        <Link
                            to="/volunteer"
                            className="
                                mt-3 sm:mt-4 block text-center
                                px-5 sm:px-6 py-2.5 sm:py-3
                                rounded-lg sm:rounded-xl
                                border border-surface/40
                                text-surface
                                hover:bg-surface/10
                                transition
                                text-sm sm:text-base
                            "
                        >
                            Become a Volunteer
                        </Link>

                        {/* tertiary */}
                        <div className="mt-5 sm:mt-6 text-center text-xs sm:text-sm text-surface/70">
                            <Link
                                to="/donate"
                                className="hover:text-surface transition"
                            >
                                Support verified needs →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* footer */}
                <p className="mt-8 sm:mt-10 text-center text-[10px] sm:text-xs text-surface/60 tracking-wide">
                    Transparent • Verified • Human-led system
                </p>
            </div>
        </section>
    );
};

export default FinalCTA;
