import React from 'react';

const StatCard = ({ stats = [], variant = 'row' }) => {
    const isColumn = variant === 'column';

    return (
        <div className="mt-9 flex gap-x-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                const isMiddle = index === Math.floor(stats.length / 2);
                const isLast = index === stats.length - 1;

                return (
                    <div
                        key={index}
                        className={`
                            flex-1
                            flex
                            ${
                                isColumn
                                    ? 'flex-col gap-4 py-3'
                                    : 'flex-row items-center gap-4'
                            }

                            ${isMiddle ? 'text-primary' : ''}
                            px-6
                            ${
                                !isLast
                                    ? 'border-r-2 border-primary-hover/20'
                                    : ''
                            }
                        `}
                    >
                        {/* ICON */}
                        <div
                            className={`
                                h-12 w-12
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
                            {Icon && <Icon size={22} strokeWidth={2.5} />}
                        </div>

                        {/* TEXT */}
                        <div className="flex flex-col gap-3">
                            <h3 className="text-xl font-bold leading-none text-primary">
                                {stat.value}
                            </h3>

                            <p className="text-sm text-text-secondary">
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
