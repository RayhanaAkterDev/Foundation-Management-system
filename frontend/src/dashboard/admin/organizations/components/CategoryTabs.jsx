import React from 'react';

const CategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <nav className="w-full">
            {tabs.map((tab, index) => {
                const active = activeCategory === tab.key;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={`
                            group
                            relative

                            flex
                            min-h-12
                            w-full
                            items-center
                            gap-3

                            px-3
                            py-2.5

                            text-left

                            transition-[background-color,color]
                            duration-150
                            ease-out

                            ${
                                active
                                    ? `
                                        bg-[#171E28]
                                        text-[#EEF1F5]!
                                    `
                                    : `
                                        bg-transparent
                                        text-[#AEB7C3]!

                                        hover:bg-[#151B24]
                                        hover:text-[#EEF1F5]!
                                    `
                            }

                            focus:outline-none
                            focus:ring-0
                        `}
                    >
                        {/* Number */}
                        <span
                            className={`
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center

                                border

                                text-[9px]
                                font-semibold!
                                tabular-nums
                                tracking-[0.04em]

                                transition-[background-color,border-color,color]
                                duration-150

                                ${
                                    active
                                        ? `
                                            border-[#394555]
                                            bg-[#1D2632]
                                            text-[#D5DAE0]!
                                        `
                                        : `
                                            border-[#252D38]
                                            bg-[#121821]
                                            text-[#657181]!

                                            group-hover:border-[#303A47]
                                            group-hover:text-[#AEB7C3]!
                                        `
                                }
                            `}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Label */}
                        <span
                            className={`
                                min-w-0
                                flex-1
                                truncate

                                text-[12px]
                                leading-5

                                transition-colors
                                duration-150

                                ${
                                    active
                                        ? 'font-semibold! text-[#EEF1F5]!'
                                        : 'font-medium! text-[#AEB7C3]! group-hover:text-[#EEF1F5]!'
                                }
                            `}
                        >
                            {tab.label}
                        </span>

                        {/* Count */}
                        <span
                            className={`
                                shrink-0

                                text-[10px]
                                tabular-nums

                                transition-colors
                                duration-150

                                ${
                                    active
                                        ? 'font-semibold! text-[#B8C0CA]!'
                                        : 'font-medium! text-[#5E6978]! group-hover:text-[#8792A1]!'
                                }
                            `}
                        >
                            {tab.count}
                        </span>

                        {/* Active marker */}
                        {active && (
                            <span
                                aria-hidden="true"
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    top-0
                                    w-0.5
                                    bg-[#697586]
                                "
                            />
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default CategoryTabs;
