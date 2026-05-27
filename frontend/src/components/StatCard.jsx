import React from 'react';
import StatValue from './StatValue';

const StatCard = ({
    stats = [],
    variant = 'row',
    size = 'section',
    style = 'card', // minimal | card
    align = 'left',
    gridCols = 'grid-cols-2 lg:grid-cols-4',
    className = '',
}) => {
    // =========================
    // SIZE STYLES
    // =========================

    const sizes = {
        hero: {
            value: 'text-2xl sm:text-3xl xl:text-4xl',
            label: 'text-sm sm:text-base',
            iconBox: 'w-14 h-14',
            icon: 24,
            padding: 'p-6 xl:p-7',
            gap: 'gap-5',
        },

        section: {
            value: 'text-xl sm:text-2xl',
            label: 'text-sm',
            iconBox: 'w-12 h-12',
            icon: 22,
            padding: 'p-5',
            gap: 'gap-4',
        },

        compact: {
            value: 'text-lg',
            label: 'text-xs',
            iconBox: 'w-10 h-10',
            icon: 18,
            padding: 'p-4',
            gap: 'gap-3',
        },
    };

    const s = sizes[size] || sizes.section;

    const alignment = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
    };

    const currentAlign = alignment[align] || alignment.left;

    if (!Array.isArray(stats) || stats.length === 0) return null;

    const isHero = size === 'hero';

    return (
        <div
            className={`
                mt-8
                grid
                ${gridCols}
                ${isHero ? 'gap-0' : 'gap-4 sm:gap-5 lg:gap-6'}
                ${className}
            `}
        >
            {stats.map((stat, index) => {
                const Icon = stat?.icon;
                const isMinimal = style === 'minimal';
                const isLast = index === stats.length - 1;

                return (
                    <div
                        key={index}
                        className={`
                            relative
                            ${s.padding}
                            transition-all duration-300

                            ${
                                isHero
                                    ? `
                                        bg-transparent
                                        shadow-none
                                        rounded-none
                                    `
                                    : isMinimal
                                      ? `
                                            rounded-2xl
                                            border border-transparent
                                            bg-transparent
                                            hover:border-primary/10
                                            hover:bg-white/70
                                            hover:shadow-sm
                                        `
                                      : `
                                            overflow-hidden
                                            rounded-3xl
                                            border border-primary/8
                                            bg-white/90
                                            backdrop-blur-sm
                                            shadow-sm
                                            hover:-translate-y-1
                                            hover:shadow-xl
                                        `
                            }
                        `}
                    >
                        {/* HERO SEPARATORS ONLY (NO BORDERS) */}
                        {isHero && !isLast && (
                            <>
                                {/* desktop vertical line */}
                                <span className="hidden lg:block absolute right-0 top-1/4 h-1/2 w-px bg-primary/10" />

                                {/* mobile horizontal line */}
                                <span className="block lg:hidden absolute bottom-0 left-1/4 w-1/2 h-px bg-primary/10" />
                            </>
                        )}

                        {/* background glow (only non-hero card mode) */}
                        {!isMinimal && !isHero && (
                            <div className="absolute inset-0 bg-linear-to-br from-primary/3 to-transparent pointer-events-none" />
                        )}

                        <div
                            className={`
                                relative
                                flex

                                ${
                                    variant === 'column'
                                        ? `flex-col ${s.gap}`
                                        : `items-center ${s.gap}`
                                }

                                ${
                                    isHero
                                        ? 'justify-center text-center'
                                        : currentAlign
                                }
                            `}
                        >
                            {/* ICON */}
                            {Icon && (
                                <div
                                    className={`
                                        ${s.iconBox}
                                        flex items-center justify-center
                                        rounded-2xl shrink-0

                                        ${
                                            isHero
                                                ? 'bg-primary/5 text-primary'
                                                : isMinimal
                                                  ? 'bg-primary/5 text-primary'
                                                  : stat?.featured
                                                    ? 'bg-primary text-white shadow-md'
                                                    : 'bg-primary/8 text-primary group-hover:bg-primary group-hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon size={s.icon} strokeWidth={2.1} />
                                </div>
                            )}

                            {/* TEXT */}
                            <div className="space-y-1">
                                <StatValue
                                    value={stat?.value}
                                    className={`
                                        font-bold
                                        tracking-tight
                                        text-text-primary/80
                                        ${s.value}
                                    `}
                                />

                                <p
                                    className={`
                                        text-text-secondary
                                        leading-relaxed
                                        ${s.label}
                                    `}
                                >
                                    {stat?.label}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCard;