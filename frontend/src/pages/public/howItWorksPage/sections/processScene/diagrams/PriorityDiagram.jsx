import React from 'react';

const cases = [
    { title: 'Medical Emergency', score: 98 },
    { title: 'Food Assistance', score: 92 },
    { title: 'Shelter Support', score: 84 },
];

const getTone = (score) => {
    if (score >= 95) return 'critical';
    if (score >= 90) return 'high';
    return 'moderate';
};

const toneStyles = {
    critical: {
        dot: 'bg-red-400',
        bar: 'bg-gradient-to-r from-red-300 to-red-200',
        text: 'text-red-400',
        ring: 'border-red-200',
        badge: 'bg-red-50 text-red-600',
        label: 'Immediate Dispatch',
    },

    high: {
        dot: 'bg-accent',
        bar: 'bg-gradient-to-r from-accent/70 to-accent/40',
        text: 'text-accent/80',
        ring: 'border-accent/40',
        badge: 'bg-accent/10 text-accent',
        label: 'High Priority',
    },

    moderate: {
        dot: 'bg-primary/50',
        bar: 'bg-gradient-to-r from-primary/40 to-primary/20',
        text: 'text-primary/70',
        ring: 'border-primary/20',
        badge: 'bg-primary/5 text-primary/70',
        label: 'Standard Queue',
    },
};

const PriorityDiagram = () => {
    return (
        <div className="w-full max-w-md sm:max-w-xl mx-auto">
            <div className="relative">
                {/* timeline */}
                <div className="absolute left-3 sm:left-4 top-4 bottom-4 w-px bg-slate-200 opacity-60" />

                <div className="space-y-6 sm:space-y-8">
                    {cases.map((item, index) => {
                        const tone = getTone(item.score);
                        const style = toneStyles[tone];

                        return (
                            <div
                                key={item.title}
                                className="relative pl-10 sm:pl-14"
                            >
                                {/* NODE */}
                                <div className="absolute left-0 top-3 sm:top-4">
                                    <div
                                        className={`
                                            w-6 h-6 sm:w-8 sm:h-8
                                            rounded-full
                                            border ${style.ring}
                                            flex items-center justify-center
                                            bg-white
                                        `}
                                    >
                                        <div
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${style.dot}`}
                                        />
                                    </div>
                                </div>

                                {/* CARD */}
                                <div className="rounded-xl sm:rounded-2xl border border-border bg-surface p-4 sm:p-6">
                                    {/* header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm sm:text-lg font-semibold text-text-primary">
                                                {item.title}
                                            </h3>

                                            <p
                                                className={`mt-1 text-xs sm:text-sm font-medium ${style.text}`}
                                            >
                                                {style.label}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <div
                                                className={`text-2xl sm:text-4xl font-bold ${style.text}`}
                                            >
                                                {item.score}
                                            </div>

                                            <div className="text-[10px] sm:text-xs uppercase tracking-widest text-text-secondary">
                                                AI Score
                                            </div>
                                        </div>
                                    </div>

                                    {/* progress */}
                                    <div className="mt-4 sm:mt-6">
                                        <div className="h-1.5 sm:h-2 rounded-full bg-slate-200 overflow-hidden">
                                            <div
                                                className={`h-full ${style.bar}`}
                                                style={{
                                                    width: `${item.score}%`,
                                                }}
                                            />
                                        </div>

                                        <div className="mt-2 flex justify-between text-[10px] sm:text-xs text-text-secondary">
                                            <span>Priority Level</span>
                                            <span>{item.score}%</span>
                                        </div>
                                    </div>

                                    {/* badge */}
                                    <div className="mt-3">
                                        <span
                                            className={`inline-flex text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${style.badge}`}
                                        >
                                            Rank #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PriorityDiagram;
