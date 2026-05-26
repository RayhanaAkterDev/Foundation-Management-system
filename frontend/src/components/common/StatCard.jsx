import React from 'react';

const StatCard = ({
    stats = [],
    variant = 'row',
    size = 'md',
    align = 'left',
    gridCols = 'lg:grid-cols-3',
    layout = 'section', // 'section' | 'hero' | 'hero-minimal'
}) => {
    const isColumn = variant === 'column';
    const isHeroMinimal = layout === 'hero-minimal';

    const sizeStyles = {
        sm: {
            iconBox: 'h-10 w-10',
            icon: 18,
            value: 'text-lg',
            label: 'text-sm',
            gap: 'gap-3',
            textGap: 'gap-2',
        },

        md: {
            iconBox: 'h-12 w-12',
            icon: 22,
            value: 'text-xl',
            label: 'text-md',
            gap: 'gap-4',
            textGap: 'gap-3',
        },

        lg: {
            iconBox: 'h-14 w-14',
            icon: 26,
            value: 'text-2xl',
            label: 'text-base font-semibold',
            gap: 'gap-6',
            textGap: 'gap-4',
        },
    };

    const alignStyles = {
        left: 'items-start text-left',
        center: 'items-center text-center',
        right: 'items-end text-right',
    };

    const s = sizeStyles[size] || sizeStyles.md;
    const textAlign = alignStyles[align] || alignStyles.left;

    return (
        <div
            className={`
                mt-8
                grid
                grid-cols-1
                sm:grid-cols-2
                ${gridCols}
                gap-5 lg:gap-6

                ${
                    layout === 'hero'
                        ? 'w-full max-w-4xl mx-auto'
                        : layout === 'hero-minimal'
                          ? 'w-full max-w-3xl mx-auto mt-6 lg:mt-8'
                          : ''
                }
            `}
        >
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isMiddle = index === Math.floor(stats.length / 2);

                return (
                    <div
                        key={index}
                        className={`
                            flex

                            ${
                                isColumn
                                    ? `flex-col ${s.gap}`
                                    : `flex-row items-center ${s.gap}`
                            }

                            ${textAlign}

                            rounded-2xl

                            ${
                                layout === 'hero-minimal'
                                    ? 'p-4 lg:p-4 bg-white/70 backdrop-blur-sm border border-primary/10'
                                    : layout === 'hero'
                                      ? 'p-6 lg:p-6 bg-white border border-primary/10 shadow-sm hover:shadow-md transition-shadow'
                                      : 'p-5 lg:p-4 bg-white border border-primary/10'
                            }
                        `}
                    >
                        {/* ICON */}
                        {Icon && (
                            <div
                                className={`
                                    ${s.iconBox}
                                    rounded-full
                                    flex items-center justify-center
                                    shrink-0

                                    ${
                                        isMiddle && layout !== 'hero-minimal'
                                            ? 'bg-primary text-white'
                                            : 'bg-primary/10 text-primary'
                                    }

                                    ${
                                        isHeroMinimal
                                            ? 'bg-primary/10 text-primary'
                                            : ''
                                    }
                                `}
                            >
                                <Icon size={s.icon} strokeWidth={2.5} />
                            </div>
                        )}

                        {/* TEXT */}
                        <div className={`flex flex-col ${s.textGap}`}>
                            <h3
                                className={`
                                    ${s.value}
                                    font-bold
                                    leading-none
                                    text-primary
                                `}
                            >
                                {stat.value}
                            </h3>

                            <p
                                className={`
                                    ${s.label}
                                    text-text-secondary
                                    leading-relaxed
                                `}
                            >
                                {stat.label}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCard;
