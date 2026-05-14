import React from 'react';
import categoryData from './data/categoryData';
import { TbHeartFilled } from 'react-icons/tb';

const CampaignCategoryNav = () => {
    return (
        <div className="lg:col-span-1 bg-surface rounded-xl px-5 py-6 shadow-sm border border-border">
            {/* heading */}
            <h3 className="text-2xl font-semibold text-text-primary leading-tight pl-4 mt-4">
                Explore by Cause
            </h3>

            {/* nav items */}
            <div className="mt-6 flex flex-col">
                {categoryData.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = index === 0;

                    return (
                        <div
                            key={item.id}
                            className={`
                                flex items-center justify-between px-4 py-4 cursor-pointer transition-all
                                ${
                                    isActive
                                        ? 'bg-primary rounded-xl shadow-md'
                                        : 'border-b border-border hover:bg-primary/5'
                                }
                            `}
                        >
                            {/* left side */}
                            <div className="flex items-center gap-4">
                                {/* icon */}
                                <div
                                    className={`
                                        w-11 h-11 leading-[11] rounded-full flex items-center justify-center
                                        ${
                                            isActive
                                                ? 'bg-white/15'
                                                : 'bg-text-secondary/10'
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`
                                            text-[22px]
                                            ${
                                                isActive
                                                    ? 'text-white'
                                                    : 'text-primary'
                                            }
                                        `}
                                    />
                                </div>

                                {/* text */}
                                <div>
                                    <h5
                                        className={`
                                            text-md font-semibold
                                            ${
                                                isActive
                                                    ? 'text-white'
                                                    : 'text-text-primary'
                                            }
                                        `}
                                    >
                                        {item.title}
                                    </h5>

                                    <p
                                        className={`
                                            text-sm mt-0.5
                                            ${
                                                isActive
                                                    ? 'text-white/80'
                                                    : 'text-text-secondary'
                                            }
                                        `}
                                    >
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* count */}
                            <div
                                className={`
                                    w-8.5 h-9 rounded-xl flex items-center justify-center text-sm font-semibold
                                    ${
                                        isActive
                                            ? 'bg-white/20 text-white'
                                            : 'bg-background text-primary'
                                    }
                                `}
                            >
                                {item.count}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* bottom support card */}
            <div className="mt-7 rounded-2xl bg-background p-5">
                <div className="flex gap-4">
                    {/* icon */}
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                        <TbHeartFilled className="text-primary text-xl" />
                    </div>

                    {/* content */}
                    <div>
                        <h4 className="text-lg font-semibold text-primary leading-snug">
                            Your Support
                            <br />
                            Creates Real Change
                        </h4>

                        <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                            Every contribution brings hope to someone in need.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CampaignCategoryNav;
