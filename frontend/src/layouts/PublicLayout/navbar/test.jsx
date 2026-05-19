import React from 'react';

// size system
const sizeStyles = {
    sm: {
        iconBox: 'h-10 w-10',
        icon: 20,
        value: 'text-lg md:text-xl',
        padding: 'py-3',
        gap: 'gap-3',
    },
    md: {
        iconBox: 'h-14 w-14',
        icon: 28,
        value: 'text-xl md:text-2xl',
        padding: 'py-5',
        gap: 'gap-5',
    },
    lg: {
        iconBox: 'h-16 w-16',
        icon: 32,
        value: 'text-xl md:text-3xl',
        padding: 'py-6',
        gap: 'gap-6',
    },
};

// shape system (NEW)
const iconShapeStyles = {
    full: 'rounded-full',
    soft: 'rounded-xl',
    square: 'rounded-md',
};

const StatCard = ({
    stats = [],
    gridClass = 'xl:grid-cols-4',
    size = 'md',
    layout = 'horizontal', // horizontal | vertical
    iconShape = 'full', // full | soft | square
}) => {
    const s = sizeStyles[size] || sizeStyles.md;
    const shapeClass = iconShapeStyles[iconShape] || iconShapeStyles.full;

    return (
        <div className={`grid grid-cols-1 gap-6 md:grid-cols-2 ${gridClass}`}>
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className={`
                            ${
                                layout === 'horizontal'
                                    ? 'flex items-center'
                                    : 'flex flex-col items-start'
                            }
                            ${s.gap} ${s.padding}
                        `}
                    >
                        {/* icon */}
                        <div
                            className={`flex items-center justify-center ${shapeClass} ${s.iconBox} ${
                                stat.featured
                                    ? 'bg-orange-100'
                                    : 'bg-primary/10'
                            }`}
                        >
                            <Icon
                                size={s.icon}
                                className={
                                    stat.featured
                                        ? 'text-accent'
                                        : 'text-primary'
                                }
                            />
                        </div>

                        {/* text */}
                        <div
                            className={`leading-tight ${
                                layout === 'vertical' ? 'mt-2' : ''
                            }`}
                        >
                            <h3
                                className={`font-bold tracking-tight ${s.value} ${
                                    stat.featured
                                        ? 'text-accent'
                                        : 'text-primary'
                                }`}
                            >
                                {stat.value}
                            </h3>

                            <p className="text-sm font-medium text-text-secondary">
                                {stat.label}
                            </p>

                            {stat.description && (
                                <p className="text-xs text-text-secondary">
                                    {stat.description}
                                </p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatCard;
