import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const PageHeader = ({ title, subtitle, action }) => {
    return (
        <header className="mb-7 overflow-hidden border border-border bg-surface sm:mb-8">
            {/* =====================================================
                MAIN HEADER
            ====================================================== */}
            <div className="relative overflow-hidden bg-primary">
                {/* Decorative background */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    <div className="absolute right-5 top-5 grid grid-cols-4 gap-1.5 opacity-[0.14] sm:right-8 sm:top-7 sm:gap-2">
                        {Array.from({ length: 16 }).map((_, index) => (
                            <span
                                key={index}
                                className="h-1 w-1 rounded-full bg-white"
                            />
                        ))}
                    </div>

                    <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full border border-white/5" />

                    <div className="absolute bottom-0 left-0 h-px w-24 bg-white/8" />
                </div>

                <div className="relative z-10 px-5 py-7 sm:px-7 sm:py-8 lg:px-9 lg:py-9">
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_250px]">
                        {/* =================================================
                            MAIN CONTENT
                        ================================================== */}
                        <div className="min-w-0">
                            {/* Platform marker */}
                            <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] sm:h-8 sm:w-8">
                                    <Sparkles
                                        size={13}
                                        strokeWidth={1.6}
                                        className="text-accent"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-[8px] font-semibold uppercase tracking-[0.2em] text-white/45 sm:text-[9px]">
                                        Stand For People
                                    </p>

                                    <p className="mt-0.5 truncate text-[10px] text-white/65 sm:text-[11px]">
                                        Humanitarian coordination platform
                                    </p>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="max-w-3xl font-fraunces text-[34px] font-semibold leading-[1.04] tracking-[-0.04em] text-white sm:text-[42px] lg:text-[50px] xl:text-[54px]">
                                {title}
                            </h1>

                            {/* Subtitle */}
                            {subtitle && (
                                <p className="mt-4 max-w-135 text-[12px] leading-5 text-white/65 sm:mt-5 sm:text-[14px] sm:leading-6 lg:text-[15px] lg:leading-7">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* =================================================
                            PURPOSE
                        ================================================== */}
                        <div className="mt-7 border-t border-white/10 pt-5 sm:mt-8 sm:pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-1">
                            <div className="flex items-start justify-between gap-5">
                                <div className="min-w-0">
                                    <span className="block text-[8px] font-semibold uppercase tracking-[0.2em] text-white/35 sm:text-[9px]">
                                        Our purpose
                                    </span>

                                    <p className="mt-2.5 max-w-47.5 font-fraunces text-[18px] leading-tight text-white/90 sm:mt-3 sm:text-[20px]">
                                        Turning human needs into coordinated
                                        action.
                                    </p>
                                </div>

                                <ArrowUpRight
                                    size={16}
                                    strokeWidth={1.5}
                                    className="mt-0.5 shrink-0 text-white/45"
                                />
                            </div>

                            <div className="mt-5 h-px w-full bg-white/10 sm:mt-6" />

                            <p className="mt-2.5 text-[9px] leading-5 text-white/40 sm:text-[10px]">
                                People · Organizations · Volunteers · Resources
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* =====================================================
                ACTION STRIP
            ====================================================== */}
            {action && (
                <div className="flex flex-col gap-3 border-t border-border bg-surface px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-7 sm:py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="h-1.5 w-1.5 shrink-0 bg-accent" />

                        <div className="min-w-0">
                            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-text-primary sm:text-[10px]">
                                Page controls
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-text-secondary sm:text-[11px]">
                                Review, manage, and take action
                            </p>
                        </div>
                    </div>

                    <div className="w-full shrink-0 sm:w-auto">{action}</div>
                </div>
            )}
        </header>
    );
};

export default PageHeader;
