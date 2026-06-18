import React from 'react';
import StatValue from './StatValue';

const StatCard = ({
    stats = [],
    size = 'section',
    tone = 'light', // light | primary
    variant = 'card', // NEW: card | line
    className = '',
}) => {
    const sizes = {
        hero: {
            value: 'text-2xl sm:text-3xl lg:text-4xl',
            label: 'text-sm sm:text-base',
            iconBox: 'w-12 h-12 sm:w-14 sm:h-14',
            icon: 22,
            padding: 'p-5 sm:p-6 lg:p-7',
            gap: 'gap-3 sm:gap-4 lg:gap-5',
        },

        section: {
            value: 'text-xl sm:text-2xl lg:text-3xl',
            label: 'text-sm sm:text-base',
            iconBox: 'w-11 h-11 sm:w-12 sm:h-12',
            icon: 20,
            padding: 'p-5 sm:p-6',
            gap: 'gap-3 sm:gap-4',
        },

        compact: {
            value: 'text-lg sm:text-xl',
            label: 'text-xs sm:text-sm',
            iconBox: 'w-10 h-10 sm:w-11 sm:h-11',
            icon: 18,
            padding: 'p-4 sm:p-5',
            gap: 'gap-2 sm:gap-3',
        },
    };

    const s = sizes[size] || sizes.section;
    const isPrimary = tone === 'primary';
    const isLine = variant === 'line';

    if (!Array.isArray(stats) || stats.length === 0) return null;

    return (
        <div
            className={`
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-5 sm:gap-6 lg:gap-8
                ${className}
            `}
        >
            {stats.map((stat, index) => {
                const Icon = stat?.icon;

                return (
                    <div
                        key={index}
                        className={`
                            relative group
                            ${s.padding}

                            flex flex-col items-center justify-center text-center
                            transition-all duration-300 ease-out

                            min-h-35 sm:min-h-40 lg:min-h-45

                            rounded-2xl

                            ${
                                isLine
                                    ? `
                                        bg-transparent
                                        border-0
                                        shadow-none
                                    `
                                    : isPrimary
                                    ? `
                                        bg-white/10
                                        backdrop-blur-md
                                        border border-white/15
                                        hover:bg-white/15
                                        hover:-translate-y-1
                                    `
                                    : `
                                        bg-surface
                                        border border-black/5
                                        shadow-sm
                                        hover:shadow-lg
                                        hover:-translate-y-1
                                    `
                            }
                        `}
                    >
                        {/* glow (DISABLED in line mode) */}
                        {!isLine && (
                            <div
                                className={`
                                    absolute inset-0 rounded-2xl pointer-events-none
                                    ${
                                        isPrimary
                                            ? 'bg-linear-to-br from-white/10 to-transparent'
                                            : 'bg-linear-to-br from-primary/5 to-transparent'
                                    }
                                `}
                            />
                        )}

                        {/* ICON */}
                        {Icon && (
                            <div
                                className={`
                                    ${s.iconBox}
                                    flex items-center justify-center
                                    rounded-xl
                                    transition-all duration-300
                                    mb-4 sm:mb-5

                                    ${
                                        isLine
                                            ? `
                                                bg-transparent
                                                text-primary
                                                mb-3 sm:mb-4
                                            `
                                            : isPrimary
                                            ? `
                                                bg-white/15 text-white
                                                group-hover:bg-white/25
                                            `
                                            : `
                                                bg-primary/10 text-primary
                                                group-hover:bg-primary group-hover:text-white
                                            `
                                    }
                                `}
                            >
                                <Icon size={s.icon} strokeWidth={2} />
                            </div>
                        )}

                        {/* VALUE */}
                        <StatValue
                            value={stat?.value}
                            className={`
                                font-bold tracking-tight
                                leading-tight
                                ${s.value}
                                ${
                                    isPrimary
                                        ? 'text-white'
                                        : 'text-text-primary'
                                }
                            `}
                        />

                        {/* LABEL */}
                        <p
                            className={`
                                mt-2 sm:mt-3
                                leading-snug sm:leading-relaxed
                                ${s.label}
                                ${
                                    isPrimary
                                        ? 'text-white/75'
                                        : 'text-text-secondary'
                                }
                            `}
                        >
                            {stat?.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCard;