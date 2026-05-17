import React from 'react';
import { TbHeart, TbUsersGroup, TbHeartHandshake } from 'react-icons/tb';

// stats data
const stats = [
    {
        icon: TbUsersGroup,
        value: '25K+',
        label: 'Lives Impacted',
    },
    {
        icon: TbHeartHandshake,
        value: '8K+',
        label: 'Volunteers',
    },
    {
        icon: TbHeart,
        value: '120+',
        label: 'Communities',
    },
];

const StatCard = () => {
    return (
        <>
            <div className="mt-10">
                <div className="grid grid-cols-1 sm:grid-cols-3">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const isMiddle = index === 1;

                        return (
                            <div
                                key={stat.label}
                                className={`
                        flex items-center gap-5 py-5
                        ${index !== stats.length - 1 ? 'md:border-r md:border-border' : ''}
                        ${index !== 0 ? 'md:pl-4' : ''}
                        ${index !== stats.length - 1 ? 'md:pr-4' : ''}
                    `}
                            >
                                {/* icon */}
                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-full transition
                            ${isMiddle ? 'bg-orange-100' : 'bg-primary/10'}
                        `}
                                >
                                    <Icon
                                        size={28}
                                        className={
                                            isMiddle
                                                ? 'text-accent'
                                                : 'text-primary'
                                        }
                                    />
                                </div>

                                {/* text */}
                                <div className="flex flex-col leading-tight">
                                    <h3
                                        className={`text-xl md:text-2xl font-bold tracking-tight
                                ${isMiddle ? 'text-accent' : 'text-text-primary'}
                            `}
                                    >
                                        {stat.value}
                                    </h3>

                                    <p
                                        className={`text-sm font-medium mt-0.5 text-text-secondary`}
                                    >
                                        {stat.label}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default StatCard;
