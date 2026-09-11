import React from 'react';

const CategoryTabs = ({ tabs, activeCategory, onChange }) => {
    return (
        <nav className="space-y-1">
            {tabs.map((tab, index) => {
                const active = activeCategory === tab.key;

                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => onChange(tab.key)}
                        className={`
                            group relative flex w-full items-center
                            gap-3 px-3.5 py-3
                            text-left
                            transition-all duration-200
                            ${
                                active
                                    ? 'bg-white text-primary'
                                    : 'text-white/65 hover:bg-white/[0.07] hover:text-white'
                            }
                        `}
                    >
                        {/* Number */}
                        <span
                            className={`
                                flex h-7 w-7 shrink-0 items-center justify-center
                                text-[9px] font-bold tracking-wide
                                transition-colors
                                ${
                                    active
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-white/8 text-white/40 group-hover:bg-white/10 group-hover:text-white/70'
                                }
                            `}
                        >
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Label */}
                        <span className="min-w-0 flex-1">
                            <span
                                className={`
                                    block truncate text-[13px] leading-5
                                    ${
                                        active
                                            ? 'font-semibold'
                                            : 'font-medium'
                                    }
                                `}
                            >
                                {tab.label}
                            </span>
                        </span>

                        {/* Count */}
                        <span
                            className={`
                                shrink-0 text-[11px] tabular-nums
                                ${
                                    active
                                        ? 'font-bold text-primary'
                                        : 'font-medium text-white/35 group-hover:text-white/65'
                                }
                            `}
                        >
                            {tab.count}
                        </span>

                        {/* Active marker */}
                        {active && (
                            <span className="absolute bottom-0 left-0 top-0 w-0.5 bg-accent" />
                        )}
                    </button>
                );
            })}
        </nav>
    );
};

export default CategoryTabs;