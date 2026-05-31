import React from 'react';
import stats from './data/heroStats';

const HeroStats = () => {
    return (
        <div className="flex flex-wrap gap-3 mt-8">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.label}
                        className={`flex items-center border border-border/60 gap-2.5 rounded-xl px-3 py-2 ${item.bg}`}
                    >
                        <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.iconBg}`}
                        >
                            <Icon className={`h-5 w-5 ${item.iconColor}`} />
                        </div>

                        <span className="text-sm font-medium text-text-secondary">
                            {item.label}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export default HeroStats;
