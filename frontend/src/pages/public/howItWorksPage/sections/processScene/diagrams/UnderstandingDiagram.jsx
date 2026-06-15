import React from 'react';

const UnderstandingDiagram = () => {
    const insights = [
        { label: 'Location', value: 'Dhaka', highlight: false },
        { label: 'Need Type', value: 'Medical Support', highlight: true },
        { label: 'Urgency Level', value: 'High', highlight: true },
        { label: 'Category', value: 'Healthcare', highlight: false },
    ];

    return (
        <div className="w-full max-w-md sm:max-w-lg mx-auto space-y-6 sm:space-y-8">
            {/* INPUT CARD */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-surface p-4 sm:p-6 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 bg-primary/10 blur-2xl rounded-full" />

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary">
                        Incoming Request
                    </span>

                    <span className="text-[9px] sm:text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                        RAW INPUT
                    </span>
                </div>

                <p className="text-base sm:text-lg font-medium leading-relaxed text-text-primary">
                    Need urgent medicine for my father in Dhaka.
                </p>

                <div className="mt-3 sm:mt-4 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 animate-pulse delay-150" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse delay-300" />
                </div>
            </div>

            {/* AI OUTPUT CARD */}
            <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-surface p-4 sm:p-6 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />

                <div className="relative">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                        <span className="font-semibold text-sm sm:text-base">
                            Structured Understanding
                        </span>

                        <span className="text-primary font-semibold text-xs sm:text-sm">
                            Confidence: 96%
                        </span>
                    </div>

                    {/* GRID */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {insights.map((item) => (
                            <div
                                key={item.label}
                                className={`
                                    rounded-xl sm:rounded-2xl
                                    p-3 sm:p-4
                                    border
                                    transition
                                    ${
                                        item.highlight
                                            ? 'border-primary/40 bg-primary/5'
                                            : 'border-border bg-transparent'
                                    }
                                `}
                            >
                                <div className="text-[10px] sm:text-xs text-text-secondary mb-1">
                                    {item.label}
                                </div>

                                <div className="text-sm sm:text-base font-semibold text-text-primary">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CONFIDENCE BAR */}
                    <div className="mt-5 sm:mt-6">
                        <div className="flex justify-between text-[10px] sm:text-xs text-text-secondary mb-2">
                            <span>Clarity Score</span>
                            <span>96%</span>
                        </div>

                        <div className="h-1.5 sm:h-2 rounded-full bg-border overflow-hidden">
                            <div className="h-full w-[96%] bg-primary rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderstandingDiagram;
