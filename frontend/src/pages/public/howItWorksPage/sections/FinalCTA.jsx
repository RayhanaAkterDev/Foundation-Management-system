import React from 'react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
    return (
        <section className="section-gap bg-primary relative overflow-hidden">
            {/* background atmosphere */}
            <div
                className="
                absolute inset-0
                bg-linear-to-br
                from-white/10
                via-transparent
                to-black/10
                pointer-events-none
            "
            />

            <div className="container-width relative">
                {/* CENTER CARD */}
                <div
                    className="
                    max-w-3xl mx-auto
                    bg-white/10
                    backdrop-blur-md
                    border border-white/20
                    rounded-3xl
                    px-6 sm:px-10 py-10 sm:py-14
                    text-center
                    shadow-xl
                "
                >
                    {/* SMALL LABEL */}
                    <p className="text-xs sm:text-sm tracking-widest text-surface/70 uppercase">
                        Join the movement
                    </p>

                    {/* HEADLINE */}
                    <h2
                        className="
                        mt-4
                        text-2xl sm:text-3xl md:text-4xl
                        font-semibold
                        text-surface
                        leading-tight
                    "
                    >
                        Turn real-world need into verified action
                    </h2>

                    {/* SUPPORT TEXT */}
                    <p
                        className="
                        mt-5
                        text-sm sm:text-base
                        text-surface/80
                        leading-relaxed
                        max-w-xl mx-auto
                    "
                    >
                        Be part of a structured system where every request is
                        verified, prioritized, and connected to real support —
                        transparently and responsibly.
                    </p>

                    {/* ACTIONS */}
                    <div
                        className="
                        mt-8 sm:mt-10
                        flex flex-col sm:flex-row
                        gap-3 sm:gap-4
                        justify-center
                    "
                    >
                        {/* PRIMARY CTA */}
                        <Link
                            to="/request"
                            className="
                                px-6 py-3
                                rounded-xl
                                bg-surface
                                text-primary
                                font-semibold
                                shadow-md
                                hover:shadow-lg
                                transition
                                w-full sm:w-auto
                            "
                        >
                            Submit a Request
                        </Link>

                        {/* SECONDARY */}
                        <Link
                            to="/volunteer"
                            className="
                                px-6 py-3
                                rounded-xl
                                border border-surface/40
                                text-surface
                                hover:bg-surface/10
                                transition
                                w-full sm:w-auto
                            "
                        >
                            Become a Volunteer
                        </Link>
                    </div>

                    {/* tertiary link row */}
                    <div
                        className="
                        mt-6
                        flex flex-wrap justify-center gap-4
                        text-sm
                        text-surface/70
                    "
                    >
                        <Link
                            to="/donate"
                            className="hover:text-surface transition"
                        >
                            Support verified needs →
                        </Link>

                        <span className="hidden sm:inline text-surface/30">
                            •
                        </span>

                        <span>Transparent • Verified • Human-led</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
