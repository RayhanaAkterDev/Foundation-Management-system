import React from 'react';

const StatCard = ({
    stats = [],
    variant = 'row',
    size = 'md',
    align = 'left',
}) => {
    const isColumn = variant === 'column';

    const sizeStyles = {
        sm: {
            iconBox: 'h-10 w-10',
            icon: 18,
            value: 'text-lg',
            label: 'text-sm',
            gap: 'gap-3',
            textGap: 'gap-2',
            pl: 'pl-2',
            pr: 'pr-2',
        },

        md: {
            iconBox: 'h-12 w-12',
            icon: 22,
            value: 'text-xl',
            label: 'text-md',
            gap: 'gap-4',
            textGap: 'gap-3',
            pl: 'pl-4',
            pr: 'pr-4',
        },

        lg: {
            iconBox: 'h-14 w-14',
            icon: 26,
            value: 'text-2xl',
            label: 'text-base font-semibold',
            gap: 'gap-6',
            textGap: 'gap-4',
            pl: 'pl-6',
            pr: 'pr-6',
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
            className="
            mt-8
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            lg:gap-4
        "
        >
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                const isMiddle = index === Math.floor(stats.length / 2);

                return (
                    <div
                        key={index}
                        className={`
                        flex-1
                        flex
                        ${
                            isColumn
                                ? `flex-col ${s.gap}`
                                : `flex-row items-center ${s.gap}`
                        }

                        ${textAlign}

                        rounded-2xl
                        p-5
                        lg:p-4

                        bg-white/60
                        backdrop-blur-sm

                        border border-primary/10
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
                                    isMiddle
                                        ? 'bg-primary text-white'
                                        : 'bg-primary/10 text-primary'
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
